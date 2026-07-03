"use client";
import React, { ReactNode, useRef } from "react";
import clsx from "clsx";
import { Link } from "next-view-transitions";
import Figure from "../Figure";
import { SanityImageAssetFull } from "@/app/sanity-api/types/sanity-expanded.types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CardLayout = "col" | "row" | "row-reverse";

export type CardAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type CardBadgeProps = {
  label: string;
  // colorVar?: string;
};

export type CardBaseProps = {
  layout?: CardLayout;
  colorVar?: string;
  badge?: CardBadgeProps;
  images?: SanityImageAssetFull[];
  videoUrl?: string;
  videoBehavior?: "inline" | "hover";
  tags?: ReactNode;
  supTitle?: string;
  title: string;
  subTitle?: string;
  description?: ReactNode;
  infoNode?: ReactNode;
  actionsNode?: ReactNode;
  actions?: CardAction[];
  footerPlacement?: "auto" | "detached";
  imagePlacement?: "auto" | "top";
  noPadding?: boolean;
  mediaSlot?: ReactNode;
  contentCount?: number;
  className?: string;
  _type?: string;
};

// ─── Badge ───────────────────────────────────────────────────────────────────

const CardBadge = ({ label }: CardBadgeProps) => {
  return !label ? undefined : (
    <div className='card__badge c-tag'>
      <svg
        width='103'
        height='111'
        viewBox='0 0 103 111'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M87.7593 -0.000772777C96.0435 -0.000787134 102.759 6.71495 102.759 14.9992L102.759 110.629L0.000430541 -0.000660476L87.7593 -0.000772777Z'
          fill='white'
        />
      </svg>

      <div className='inner'>{label}</div>
    </div>
  );
};

// ─── CardFooter (mode detached — rendu par le parent) ────────────────────────

export const CardFooter = ({
  actions,
  actionsNode,
}: {
  actions: CardAction[];
  actionsNode?: ReactNode;
}) => (
  <div className='card__footer'>
    <div className='card__btns'>
      {actions.map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className={clsx(
            "btn",
            action.variant === "secondary" && "btn--secondary",
          )}>
          {action.label}
        </Link>
      ))}
      {actionsNode}
    </div>
  </div>
);

// ─── ActionButtons ────────────────────────────────────────────────────────────

const ActionButtons = ({
  actions,
  actionsNode,
}: {
  actions: CardAction[];
  actionsNode?: ReactNode;
}) => (
  <div className='card__btns'>
    {actions.map((action, i) => (
      <Link
        key={i}
        href={action.href}
        className={clsx(
          "btn",
          action.variant === "secondary" && "btn--secondary",
        )}>
        {action.label}
      </Link>
    ))}
    {actionsNode}
  </div>
);

// ─── CardBase ────────────────────────────────────────────────────────────────

const CardBase = ({
  layout = "col",
  colorVar,
  badge,
  images = [],
  videoUrl,
  videoBehavior = "inline",
  tags,
  supTitle,
  title,
  subTitle,
  description,
  infoNode,
  actionsNode,
  actions = [],
  footerPlacement = "auto",
  imagePlacement = "auto",
  noPadding = false,
  mediaSlot: customMediaSlot,
  contentCount,
  className,
}: CardBaseProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoBehavior === "hover" && videoRef.current) videoRef.current.play();
  };
  const handleMouseLeave = () => {
    if (videoBehavior === "hover" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const hasVideo = Boolean(videoUrl);
  const isDetached = footerPlacement === "detached";
  const hasMedia = images.length > 0 || hasVideo || Boolean(customMediaSlot);

  const mediaBlock = (
    <div className='card__media'>
      {customMediaSlot ??
        (hasVideo && videoBehavior === "inline" ? (
          <div className='card__video-wrap'>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              preload='metadata'
              className='card__video'
            />
          </div>
        ) : hasVideo && videoBehavior === "hover" ? (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            preload='none'
            className='card__video card__video--hover'
          />
        ) : (
          images.map((asset, i) => <Figure key={i} asset={asset} />)
        ))}
    </div>
  );

  const headerSlot = (
    <div className='card__header'>
      {tags && <div className='card__tags c-tag'>{tags}</div>}
      {supTitle && (
        <div className='card__sup-title c-body'>
          {contentCount !== undefined
            ? `[${contentCount}] ${supTitle}`
            : supTitle}
        </div>
      )}
      {contentCount !== undefined && !supTitle && (
        <div className='card__sup-title c-body'>[{contentCount}]</div>
      )}
      <h3 className='card__title c-h2'>{title}</h3>
      {subTitle && <div className='card__subtitle c-h3'>{subTitle}</div>}
    </div>
  );

  const cardInnerClass = clsx(
    "card__inner",
    layout === "col" ? "card__inner--col" : "card__inner--row",
    layout === "row-reverse" && "card__inner--row-reverse",
    noPadding && "card__inner--no-padding",
    className,
  );
  const cardStyle = colorVar
    ? ({ "--card-color": colorVar } as React.CSSProperties)
    : undefined;
  const handlers = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  // ── COL + image top ──────────────────────────────────────────────────────────
  // card__media → card__body(header + footer(infoNode + btns))
  if (layout === "col" && imagePlacement === "top") {
    return (
      <div className={cardInnerClass} style={cardStyle} {...handlers}>
        {hasMedia && mediaBlock}
        {badge && <CardBadge {...badge} />}

        <div className='card__body'>
          {headerSlot}
          {(infoNode || actions.length > 0 || actionsNode) && (
            <div className='card__footer'>
              {infoNode && (
                <div className='card__info c-body-xs'>{infoNode}</div>
              )}
              {(actions.length > 0 || actionsNode) && (
                <ActionButtons actions={actions} actionsNode={actionsNode} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── COL ──────────────────────────────────────────────────────────────────────
  // header → media → footer(description + infoNode + btns)
  if (layout === "col") {
    return (
      <div className={cardInnerClass} style={cardStyle} {...handlers}>
        {badge && <CardBadge {...badge} />}
        {headerSlot}
        {hasMedia && mediaBlock}
        {!hasMedia && (
          <div className='card__media'>
            <div className='card__media-inner' />
          </div>
        )}
        {!isDetached && (description || infoNode || actions.length > 0 || actionsNode) && (
          <div className='card__footer'>
            {description && (
              <div className='card__description c-body'>{description}</div>
            )}
            {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
            {(actions.length > 0 || actionsNode) && (
              <ActionButtons actions={actions} actionsNode={actionsNode} />
            )}
          </div>
        )}
        {isDetached && (description || infoNode) && (
          <div className='card__footer'>
            {description && (
              <div className='card__description c-body'>{description}</div>
            )}
            {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
          </div>
        )}
      </div>
    );
  }

  // ── ROW ──────────────────────────────────────────────────────────────────────
  // card__body(header + footer(infoNode + btns)) | card__media
  if (!isDetached) {
    return (
      <div className={cardInnerClass} style={cardStyle} {...handlers}>
        {badge && <CardBadge {...badge} />}

        <div className='grid'>
          <div className='card__body'>
            {headerSlot}
            {description && (
              <div className='card__description c-body'>{description}</div>
            )}
            {(infoNode || actions.length > 0 || actionsNode) && (
              <div className='card__footer'>
                {infoNode && (
                  <div className='card__info c-body-xs'>{infoNode}</div>
                )}
                {(actions.length > 0 || actionsNode) && (
                  <ActionButtons actions={actions} actionsNode={actionsNode} />
                )}
              </div>
            )}
          </div>
          {hasMedia && mediaBlock}
        </div>
      </div>
    );
  }

  // ── ROW + detached ───────────────────────────────────────────────────────────
  // card__body(body-header(header + description) + body-footer(infoNode)) | card__media
  // card__footer rendu par le parent via <CardFooter>
  return (
    <div className={cardInnerClass} style={cardStyle} {...handlers}>
      {badge && <CardBadge {...badge} />}

      <div className='grid'>
        <div className='card__body'>
          <div className='card__body-header'>
            {headerSlot}
            {description && (
              <div className='card__description c-body'>{description}</div>
            )}
          </div>
          <div className='card__body-footer'>
            {infoNode && <div className='card__info c-body-xs'>{infoNode}</div>}
          </div>
        </div>
        {hasMedia && mediaBlock}
      </div>
    </div>
  );
};

export default CardBase;
