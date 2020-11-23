(function (w) {
    w.transformCss = function (node, name, value) {
        if (!node.transform) {
            node.transform = {};
        }
        // arguments 传参个数
        if (arguments.length > 2) {
            // 带value就是写的操作
            // 写
            node.transform[name] = value
            var result = '';
            for (var item in node.transform) {
                switch (item) {
                    case 'rotate': 0 // 为0相当于没有旋转
                    case 'skew': 0
                    case 'skewX': 0
                    case 'skewY': 0
                        result = item + '('+ node.transform[item] +'deg)';
                        break;
                    case 'scale': 1 // 缩放比例为1，相当于没有缩放
                    case 'scaleX': 1
                    case 'scaleY': 1
                        result = item + '('+ node.transform[item] +')';
                        break;
                    case 'translate': 0
                    case 'translateX': 0
                    case 'translateY': 0
                        result = item + '('+ node.transform[item] +'px)';
                        break;
                }
            }
            node.style.transform = result;
        } else {
            // 不传value就是读的操作
            // 读
            if (typeof node.transform[name] == 'undefined') {
                if (name == 'scale' || name == 'skewX' || name == 'skewY') {
                    value = 1
                } else {
                    value = 0
                }
            } else {
                value = node.transform[name]
            }
            return value
        }
    }
})(window)