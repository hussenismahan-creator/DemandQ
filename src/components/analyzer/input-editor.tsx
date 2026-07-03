"use client";

import { useRef, useState } from "react";
import { Upload, Sparkles, FileCode2, Trash2, Terminal, AlertTriangle, ScrollText, Bug } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AnalysisInput, InputSource } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAMPLE_LOG } from "@/data/mock-data";

interface InputEditorProps {
  onAnalyze: (input: AnalysisInput) => void;
  disabled?: boolean;
}

const SOURCE_TABS: { value: InputSource; label: string; icon: typeof Terminal }[] = [
  { value: "logs", label: "Logs", icon: ScrollText },
  { value: "stack_trace", label: "Stack trace", icon: Bug },
  { value: "terminal", label: "Terminal", icon: Terminal },
  { value: "error_message", label: "Error", icon: AlertTriangle },
];

const PLACEHOLDERS: Record<InputSource, string> = {
  logs: "Paste application or infrastructure logs…\n\n2026-07-03T08:58:12Z ERROR [service] …",
  stack_trace: "Paste a stack trace…\n\nTraceback (most recent call last): …",
  terminal: "Paste terminal / CLI output…\n\n$ npm run deploy\nError: …",
  error_message: "Paste the error message or exception…",
  file_upload: "",
};

/** The analyzer's large code-editor input with source tabs, upload and sample. */
export function InputEditor({ onAnalyze, disabled }: InputEditorProps) {
  const [source, setSource] = useState<InputSource>("logs");
  const [content, setContent] = useState("");
  const [service, setService] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = content ? content.split("\n").length : 0;
  const charCount = content.length;
  const canAnalyze = content.trim().length > 0 && !disabled;

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      toast.error("File too large", { description: "Please upload a file under 1 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setContent(String(reader.result ?? ""));
      setFileName(file.name);
      setSource("file_upload");
      toast.success("File loaded", { description: file.name });
    };
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsText(file);
  }

  function loadSample() {
    setContent(SAMPLE_LOG);
    setSource("logs");
    setFileName(undefined);
  }

  function clear() {
    setContent("");
    setFileName(undefined);
  }

  function submit() {
    if (!canAnalyze) return;
    onAnalyze({
      content,
      source: fileName ? "file_upload" : source,
      service: service.trim() || undefined,
      fileName,
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-4 py-2.5">
        <Tabs value={source} onValueChange={(v) => setSource(v as InputSource)}>
          <TabsList>
            {SOURCE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.json,.trace,text/*"
            className="hidden"
            onChange={handleFile}
          />
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={loadSample}>
            <FileCode2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sample</span>
          </Button>
        </div>
      </div>

      {/* Editor surface */}
      <div className="relative">
        {fileName && (
          <div className="flex items-center gap-2 border-b border-border/60 bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
            <FileCode2 className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">{fileName}</span>
          </div>
        )}
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (fileName) setFileName(undefined);
          }}
          placeholder={PLACEHOLDERS[source]}
          spellCheck={false}
          disabled={disabled}
          className="min-h-[320px] resize-y rounded-none border-0 bg-transparent px-4 py-4 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Footer / actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="service" className="text-xs text-muted-foreground">
              Service
            </label>
            <input
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="optional"
              className="h-7 w-32 rounded-md border border-input bg-background/50 px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <span className="hidden text-xs tabular-nums text-muted-foreground/70 sm:inline">
            {lineCount} lines · {charCount} chars
          </span>
        </div>

        <div className="flex items-center gap-2">
          {content && (
            <Button variant="ghost" size="sm" onClick={clear} disabled={disabled}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          <Button size="sm" onClick={submit} disabled={!canAnalyze}>
            <Sparkles className="h-4 w-4" />
            Analyze incident
          </Button>
        </div>
      </div>
    </div>
  );
}
