export default function ActivityLog(log) {
    return (
        <div className="flex items-center w-full my-6 -ml-1.5">
            <div className="w-1/12 z-10">
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
            </div>
            <div className="sm:ml-4 ml-1 w-11/12">
                <p className="text-sm">{log.action}.</p>
                <p className="text-xs text-gray-500">{log.changeTime}</p>
            </div>
        </div>
    )
}
