import { _localizeText } from "@/app/sanity-api/utils";

type Props = {
  onClick: () => void;
};

const LoadMoreButton = ({ onClick }: Props) => (
  <div className='load-more'>
    <button type='button' className='btn' onClick={onClick}>
      {_localizeText("loadMore")}
    </button>
  </div>
);

export default LoadMoreButton;
