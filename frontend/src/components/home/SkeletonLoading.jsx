import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function SkeletonLoading() {
  return (
    <div className="d-flex flex-column gap-3 w-100">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-lab-md p-3 ms-2" style={{ backgroundColor: 'var(--lab-surface-container-low)' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Skeleton width={180} height={20} />
            <Skeleton width={60} height={14} />
          </div>
          <Skeleton count={2} height={14} style={{ marginTop: '6px' }} />
        </div>
      ))}
    </div>
  )
}