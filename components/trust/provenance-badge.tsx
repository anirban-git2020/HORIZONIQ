import { Badge } from "@/components/ui/badge";
import {
  getProvenanceBadgeVariant,
  getProvenanceShortLabel,
  type DataProvenance,
} from "@/lib/trust";

interface ProvenanceBadgeProps {
  provenance: DataProvenance;
  className?: string;
}

export function ProvenanceBadge({ provenance, className }: ProvenanceBadgeProps) {
  return (
    <Badge variant={getProvenanceBadgeVariant(provenance)} className={className}>
      {getProvenanceShortLabel(provenance)}
    </Badge>
  );
}
