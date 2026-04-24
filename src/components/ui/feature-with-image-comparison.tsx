import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import floorplanImage from "@/assets/feature-floorplan.jpg";
import interiorImage from "@/assets/feature-interior.jpg";

function Feature() {
  const { t } = useTranslation();
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;
    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }
    const percentage = (x / rect.width) * 100;
    setInset(percentage);
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <Badge>Property</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              {t('home.before_after')}
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              {t('home.before_after_subtitle')}
            </p>
          </div>
          <div className="pt-12 w-full">
            <div
              className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
              onMouseMove={onMouseMove}
              onMouseUp={() => setOnMouseDown(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setOnMouseDown(false)}
            >
              <div
                className="bg-muted h-full w-1 absolute z-20 top-0 -ml-1 select-none"
                style={{ left: inset + "%" }}
              >
                <button
                  className="bg-muted rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setOnMouseDown(true);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setOnMouseDown(true);
                  }}
                  onTouchEnd={() => setOnMouseDown(false)}
                  onMouseUp={() => setOnMouseDown(false)}
                >
                  <GripVertical className="h-4 w-4 select-none" />
                </button>
              </div>

              <img
                className="absolute left-0 top-0 z-10 w-full h-full object-cover select-none pointer-events-none"
                src={interiorImage}
                style={{ clipPath: `inset(0 0 0 ${inset}%)` }}
                alt="After renovation - finished interior"
              />

              <img
                className="absolute left-0 top-0 w-full h-full object-cover select-none pointer-events-none"
                src={floorplanImage}
                alt="Before - floor plan"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
