
exports.formatDecimal = function(number, place = 4) {
  if (!number || Number(number) === 0) return 0
  return Number(number).toFixed(place)
}

exports.throttle = function(fn, delay) {
  var timer = null
 	return function() {
 		var context = this, args = arguments
 		clearTimeout(timer)
 		timer = setTimeout(function(){
 			fn.apply(context, args)
 		}, delay)
 	}
}

exports.formatDate = function(date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))

  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))

  return fmt
}

exports.formatCurrentTime = function() {
  const currentdate = new Date()
  const datetime =
    "Last Sync: "
    + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds()

  return datetime
}
