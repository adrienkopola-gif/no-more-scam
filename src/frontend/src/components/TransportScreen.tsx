import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Bus, Car, Filter, Loader2, Train, Users } from "lucide-react";
import React, { useState } from "react";
import { useActor } from "../hooks/useActor";

// Local TransportRoute interface since it's not exported from backend
interface LocalTransportRoute {
  id: bigint;
  origin: string;
  destination: string;
  transportMode: Record<string, unknown>;
  price: bigint;
  duration: bigint;
  advice: string;
}

const TRANSPORT_MODES = [
  "All",
  "bus",
  "train",
  "sharedTaxi",
  "publicTransport",
  "luxuryTransport",
  "rentalCar",
  "guide",
];

const transportModeIcon = (mode: string) => {
  switch (mode) {
    case "bus":
      return <Bus className="h-4 w-4" />;
    case "train":
      return <Train className="h-4 w-4" />;
    case "rentalCar":
      return <Car className="h-4 w-4" />;
    case "sharedTaxi":
    case "publicTransport":
      return <Users className="h-4 w-4" />;
    default:
      return <Bus className="h-4 w-4" />;
  }
};

const transportModeLabel = (mode: string) => {
  const labels: Record<string, string> = {
    bus: "Bus",
    train: "Train",
    sharedTaxi: "Taxi partagé",
    publicTransport: "Transport public",
    luxuryTransport: "Transport luxe",
    rentalCar: "Location voiture",
    guide: "Guide",
  };
  return labels[mode] || mode;
};

export default function TransportScreen() {
  const { actor, isFetching } = useActor();
  const [selectedMode, setSelectedMode] = useState("All");

  const { data: routes = [], isLoading } = useQuery<LocalTransportRoute[]>({
    queryKey: ["transportRoutes"],
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !isFetching,
  });

  const filteredRoutes =
    selectedMode === "All"
      ? routes
      : routes.filter((r) => {
          const modeKey = Object.keys(r.transportMode)[0];
          return modeKey === selectedMode;
        });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Bus className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold">Transport Routes</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {TRANSPORT_MODES.map((mode) => (
          <Button
            key={mode}
            variant={selectedMode === mode ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMode(mode)}
            className="text-xs h-7"
          >
            {mode === "All" ? "All" : transportModeLabel(mode)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bus className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No transport routes available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Advice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => {
                const modeKey = Object.keys(route.transportMode)[0];
                return (
                  <TableRow key={route.id.toString()}>
                    <TableCell className="font-medium">
                      {route.origin}
                    </TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {transportModeIcon(modeKey)}
                        <span className="text-xs">
                          {transportModeLabel(modeKey)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{route.duration.toString()} min</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {route.price.toString()} MAD
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                      {route.advice}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
