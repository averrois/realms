"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { UrlObject } from "url";

type PropsType = {
  children: React.ReactNode,
  href: string | UrlObject,
  as?: string | UrlObject;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export default function DynamicLink({children, href, as, replace, scroll, prefetch, className, onClick}: PropsType) {
  const router = useRouter();

  const refreshClick = (e: MouseEvent<HTMLElement>) => {
    router.refresh();
  }

  return (
    <div
      onClick={refreshClick}
      className={className}
    >
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        prefetch={prefetch}
        onClick={onClick}
      >
        {children}
      </Link>
    </div>
  );
};