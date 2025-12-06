import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface WhyDVukaProps {
  title: string;
  description: string;
  items: string[];
  buttonText: string;
  buttonHref: string;
  imageSrc: string;
  bgColor: string;
}

export default function WhyDVukaComponent({
  title,
  description,
  items,
  buttonText,
  buttonHref,
  imageSrc,
  bgColor,
}: WhyDVukaProps) {
  return (
    <div
      className={`h-full flex flex-col border border-border overflow-hidden ${bgColor} text-white rounded-md transition-all duration-300 hover:scale-[1.01]`}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-2 flex flex-col justify-between flex-grow text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {title}
          </h3>

          <p className="text-base mb-2 opacity-90">
            {description}
          </p>

          <p className="text-sm mb-4 font-medium opacity-80">
            {items.map((item, index) => (
              <Fragment key={item}>
                {item}
                {index < items.length - 1 && (
                  <span className="mx-1 opacity-70">&bull;</span>
                )}
              </Fragment>
            ))}
          </p>
        </div>

        <Link
          href={buttonHref}
          className="inline-block mt-auto bg-primary-foreground text-sm font-medium py-2 px-4 rounded-sm text-accent-foreground transition-colors duration-200 hover:bg-gray-100/90"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}