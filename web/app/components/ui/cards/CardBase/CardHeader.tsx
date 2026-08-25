import { ReactNode } from "react";

type CardHeaderProps = {
  tags?: ReactNode;
  supTitle?: string;
  contentCount?: number;
  title: string;
  subTitle?: string;
};

export const CardHeader = ({
  tags,
  supTitle,
  contentCount,
  title,
  subTitle,
}: CardHeaderProps) => (
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
