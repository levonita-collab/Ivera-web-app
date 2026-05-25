import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin } from "lucide-react";
import { Tour } from "@/data/tours";
import { formatPrice } from "@/lib/pricing";
import Badge from "@/components/ui/Badge";

interface Props {
  tour: Tour;
}

const categoryLabels: Record<Tour["category"], string> = {
  culture: "Culture",
  adventure: "Adventure",
  wine: "Wine",
  heritage: "Heritage",
};

export default function TourCard({ tour }: Props) {
  return (
    <Link href={`/tours/${tour.slug}`} className="block group">
      <article className="rounded-2xl overflow-hidden bg-brand-dark border border-white/5 hover:border-brand-gold/30 transition-all duration-300">
        {/* Hero band */}
        <div className="h-36 relative flex items-end p-4">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="relative z-10 flex items-end justify-between w-full">
            <Badge label={categoryLabels[tour.category]} variant="gold" />
            <span className="text-white/70 text-xs">{tour.duration}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-serif text-white font-semibold text-base leading-snug group-hover:text-brand-gold transition-colors">
              {tour.title}
            </h3>
            <p className="mt-1 text-xs text-brand-muted leading-relaxed line-clamp-2">
              {tour.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {tour.region}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} />
              Small group
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-sm font-semibold text-brand-gold">
              {formatPrice(tour.pricePerPersonGel, tour.priceLabel)}
              {tour.pricePerPersonGel && (
                <span className="text-xs text-brand-muted font-normal"> / person</span>
              )}
            </span>
            <span className="text-xs text-brand-gold font-medium group-hover:underline">
              View Quest →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
