"use client";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { CardBaseProps } from "./types";
import { CardBadge } from "./CardBadge";
import { CardHeader } from "./CardHeader";
import { CardMedia } from "./CardMedia";
import { CardLinkOverlay } from "./CardLinkOverlay";
import { ActionButtons } from "./CardFooter";

export type { CardLayout, CardAction, CardBadgeProps, CardBaseProps } from "./types";
export { CardFooter } from "./CardFooter";

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
  style,
  imageSizes = "(max-width: 767px) 100vw, 25vw",
}: CardBaseProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Tracked on this outer wrapper rather than inside mediaSlot itself: the
  // full-card `CardLinkOverlay` (position: absolute, z-index: 1) sits on top
  // of `.card__media` and wins hit-testing, so a mediaSlot component's own
  // mouseenter/mouseleave never fire. This element is an ancestor of that
  // overlay, so it still receives them — forward the state down instead.
  const [mediaHovered, setMediaHovered] = useState(false);

  const handleMouseEnter = () => {
    if (videoBehavior === "hover" && videoRef.current) videoRef.current.play();
    setMediaHovered(true);
  };
  const handleMouseLeave = () => {
    if (videoBehavior === "hover" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setMediaHovered(false);
  };

  const hasVideo = Boolean(videoUrl);
  const isDetached = footerPlacement === "detached";
  const hasMedia = images.length > 0 || hasVideo || Boolean(customMediaSlot);

  const hoverableMediaSlot =
    customMediaSlot && React.isValidElement(customMediaSlot)
      ? React.cloneElement(customMediaSlot as React.ReactElement<any>, {
          hovered: mediaHovered,
        })
      : customMediaSlot;

  const mediaBlock = (
    <CardMedia
      images={images}
      videoUrl={videoUrl}
      videoBehavior={videoBehavior}
      videoRef={videoRef}
      customMediaSlot={hoverableMediaSlot}
      imageSizes={imageSizes}
    />
  );

  const headerSlot = (
    <CardHeader
      tags={tags}
      supTitle={supTitle}
      contentCount={contentCount}
      title={title}
      subTitle={subTitle}
    />
  );

  const cardInnerClass = clsx(
    "card__inner",
    layout === "col" ? "card__inner--col" : "card__inner--row",
    layout === "row-reverse" && "card__inner--row-reverse",
    noPadding && "card__inner--no-padding",
    className,
  );
  const cardStyle: React.CSSProperties | undefined =
    colorVar || style
      ? {
          ...(colorVar &&
            ({ "--card-color": colorVar } as React.CSSProperties)),
          ...style,
        }
      : undefined;
  const handlers = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
  const primaryAction = actions[0];

  // ── COL + image top ──────────────────────────────────────────────────────────
  // card__media → card__body(header + footer(infoNode + btns))
  if (layout === "col" && imagePlacement === "top") {
    return (
      <div className={cardInnerClass} style={cardStyle} {...handlers}>
        {primaryAction && <CardLinkOverlay href={primaryAction.href} />}
        {hasMedia && mediaBlock}
        {badge && <CardBadge {...badge} />}

        <div className='card__body'>
          {headerSlot}
          {(infoNode || actions.length > 0 || actionsNode) && (
            <div className='card__footer'>
              <div className='card_footer-content'>
                {infoNode && (
                  <div className='card__info c-body-xs'>{infoNode}</div>
                )}
                {(actions.length > 0 || actionsNode) && (
                  <ActionButtons actions={actions} actionsNode={actionsNode} />
                )}
              </div>
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
        {primaryAction && <CardLinkOverlay href={primaryAction.href} />}
        {badge && <CardBadge {...badge} />}
        {headerSlot}
        {hasMedia && mediaBlock}
        {!hasMedia && (
          <div className='card__media'>
            <div className='card__media-inner' />
          </div>
        )}
        {!isDetached &&
          (description || infoNode || actions.length > 0 || actionsNode) && (
            <div className='card__footer'>
              <div className='card__footer-content'>
                {description && (
                  <div className='card__description c-body-xs'>
                    {description}
                  </div>
                )}
                {infoNode && (
                  <div className='card__info c-body-xs'>{infoNode}</div>
                )}
                {(actions.length > 0 || actionsNode) && (
                  <ActionButtons actions={actions} actionsNode={actionsNode} />
                )}
              </div>
            </div>
          )}
        {isDetached && (description || infoNode) && (
          <div className='card__footer'>
            <div className='card__footer-content'>
              {description && (
                <div className='card__description c-body-xs'>{description}</div>
              )}
              {infoNode && (
                <div className='card__info c-body-xs'>{infoNode}</div>
              )}
            </div>
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
        {primaryAction && <CardLinkOverlay href={primaryAction.href} />}
        {badge && <CardBadge {...badge} />}

        <div className='grid'>
          <div className='card__body'>
            {headerSlot}
            {description && (
              <div className='card__description c-body-xs'>{description}</div>
            )}
            {(infoNode || actions.length > 0 || actionsNode) && (
              <div className='card__footer'>
                <div className='card_footer-content'>
                  {infoNode && (
                    <div className='card__info c-body-xs'>{infoNode}</div>
                  )}
                  {(actions.length > 0 || actionsNode) && (
                    <ActionButtons
                      actions={actions}
                      actionsNode={actionsNode}
                    />
                  )}
                </div>
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
      {primaryAction && <CardLinkOverlay href={primaryAction.href} />}
      {badge && <CardBadge {...badge} />}

      <div className='grid'>
        <div className='card__body'>
          <div className='card__body-header'>
            {headerSlot}
            {description && (
              <div className='card__description c-body-xs'>{description}</div>
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
