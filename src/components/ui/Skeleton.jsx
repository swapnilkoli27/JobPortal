// Skeleton loading components
export const SkeletonJobCard = () => (
  <div className="card p-5 space-y-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="skeleton w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-3 rounded w-full" />
      <div className="skeleton h-3 rounded w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-8 w-20 rounded-xl" />
    </div>
  </div>
)

export const SkeletonHero = () => (
  <div className="space-y-6 animate-pulse">
    <div className="skeleton h-10 w-2/3 rounded-xl mx-auto" />
    <div className="skeleton h-6 w-1/2 rounded-xl mx-auto" />
    <div className="skeleton h-16 rounded-2xl max-w-2xl mx-auto" />
  </div>
)

export const SkeletonJobDetail = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex gap-4">
      <div className="skeleton w-20 h-20 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="skeleton h-7 w-2/3 rounded-xl" />
        <div className="skeleton h-5 w-1/3 rounded-xl" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="skeleton h-6 w-20 rounded-full" />)}
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-4 rounded w-full" />)}
    </div>
  </div>
)

export const SkeletonAnalyticsCard = () => (
  <div className="card p-6 space-y-3 animate-pulse">
    <div className="skeleton h-4 w-24 rounded" />
    <div className="skeleton h-10 w-16 rounded-xl" />
    <div className="skeleton h-3 w-32 rounded" />
  </div>
)

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
)

export default SkeletonJobCard
