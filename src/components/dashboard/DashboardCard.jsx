import { ArrowUp, ArrowDown } from "lucide-react"

const DashboardCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>

          {trend && (
            <div className="flex items-center mt-2">
              {trendUp !== null &&
                (trendUp ? (
                  <ArrowUp size={14} className="text-green-500 mr-1" />
                ) : (
                  <ArrowDown size={14} className="text-red-500 mr-1" />
                ))}
              <span
                className={`text-xs font-medium ${
                  trendUp === null ? "text-gray-500" : trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>

        <div className="p-2 rounded-md bg-gray-100">{icon}</div>
      </div>
    </div>
  )
}

export default DashboardCard
