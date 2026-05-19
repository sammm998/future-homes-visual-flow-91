import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  phase?: string;
}

export default function AdminPlaceholder({ title, description, phase }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <Card className="bg-admin-surface">
        <CardHeader>
          <div className="flex items-center gap-2 text-admin-accent">
            <Construction className="h-5 w-5" />
            <CardTitle className="text-base">Coming in {phase ?? "the next phase"}</CardTitle>
          </div>
          <CardDescription>
            The admin shell, role guard, and database schema for this section are already
            in place. The interactive UI ships in the next phase to keep each release stable
            and reviewable.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Need this sooner? Tell me which section to build next and I will promote it ahead
          of the queue.
        </CardContent>
      </Card>
    </div>
  );
}
