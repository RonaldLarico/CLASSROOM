import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Calendar, Users, Dot, Image, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchGraduatesData } from "@/lib/actionsAdvice/actionsGet";
import { useAuth } from "@/context/Authcontext";
import { Graduate } from "@/lib/definitions";
import { ScrollArea } from "@/components/ui/scroll-area";
import GraduateCard from "./graduate-copy-Card";

const GraduateList = () => {
  const { token } = useAuth();
  const tokenString: string = token ?? "";
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const newGraduates = await fetchGraduatesData({
        offset,
        limit: 5,
        token: tokenString,
      });
      setGraduates((prev) => [...prev, ...newGraduates]);
      setOffset((prevOffset) => prevOffset + newGraduates.length);

      if (newGraduates.length < 5) setHasMore(false);
    } catch (error) {
      setError("" + error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const lastGraduateRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      
      if (observer.current) observer.current.disconnect();
  
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
  
      if (node) observer.current.observe(node);  // Ensure node is not null
    },
    [loading, hasMore ]
  );
  
  useEffect(() => {
    loadMore(); // Initial load
  }, []);


  return (
    <ScrollArea className="h-[calc(100vh-260px)] w-full overflow-y-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center gap-3">
        {graduates.map((graduate, index) => (
          <GraduateCard key={index} graduate={graduate} />
        ))}
        <div ref={lastGraduateRef}>
          {loading && <Loader2 className="h-8 w-8 animate-spin" />}
        </div>
      </div>
    </ScrollArea>
  );
};

export default GraduateList;
