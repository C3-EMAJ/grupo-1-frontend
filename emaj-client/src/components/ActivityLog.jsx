export default function ActivityLog(log) {
    return (
        <div class="flex items-center w-full my-6 -ml-1.5">
            <div class="w-1/12 z-10">
                <div class="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
            </div>
            <div class="sm:ml-4 ml-1 w-11/12">
                <p class="text-sm">{log.action}.</p>
                <p class="text-xs text-gray-500">{log.changeTime}</p>
            </div>
        </div>
    )
}
