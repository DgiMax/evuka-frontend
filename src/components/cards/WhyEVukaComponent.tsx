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
      className={`max-w-sm rounded-xl overflow-hidden ${bgColor} text-white`}
      style={{ borderRadius: "5px", padding: "5px" }}
    >
      {/* 1. Image Block */}
      <div className="relative h-30 w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
          style={{ borderRadius: "5px 5px 0 0" }}
        />
      </div>

      {/* 2. Content Block */}
      <div className="p-2 text-center">
        <h3 className="text-3xl mb-2" style={{ fontSize: "20px" }}>
          {title}
        </h3>

        <p className="text-lg mb-1 font-normal" style={{ fontSize: "16px" }}>
          {description}
        </p>

        <p className="text-base mb-2 font-medium" style={{ fontSize: "15px" }}>
          {items.map((item, index) => (
            <Fragment key={item}>
              {item}
              {index < items.length - 1 && (
                <span className="mx-1 opacity-70">&bull;</span>
              )}
            </Fragment>
          ))}
        </p>

        <Link
          href={buttonHref}
          className="inline-block bg-primary-foreground text-lg py-2 px-8 rounded-[3px] text-accent-foreground transition duration-200 hover:bg-gray-100"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
