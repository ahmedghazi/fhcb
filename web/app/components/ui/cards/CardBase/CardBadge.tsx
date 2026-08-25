import { CardBadgeProps } from "./types";

export const CardBadge = ({ label }: CardBadgeProps) => {
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
