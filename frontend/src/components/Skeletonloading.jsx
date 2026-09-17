import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonLoading() {
  return (
    <div className="profile">
      <div className="profile-left">
        <div className="profile-photo">
          <Skeleton circle width={220} height={220} />
        </div>
        <div className="cargo-badge">
          <Skeleton width={180} height={30} />
        </div>
        <div className="nome-badge">
          <Skeleton width={200} height={40} />
        </div>
      </div>

      <div className="profile-right">
        <div className="field">
          <Skeleton width={80} height={20} />
          <Skeleton height={40} style={{ borderRadius: "999px" }} />
        </div>
        <div className="field">
          <Skeleton width={80} height={20} />
          <Skeleton height={40} style={{ borderRadius: "999px" }} />
        </div>
        <div className="field">
          <Skeleton width={80} height={20} />
          <Skeleton height={40} style={{ borderRadius: "999px" }} />
        </div>
      </div>
    </div>
  );
}