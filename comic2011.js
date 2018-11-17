var g_js_root = '';
var g_s_url_prefix = '//sacg.dmzj.com/';

function dealComicBlock(page_index, perpage, data, template, ids) {
    var min = (page_index - 1) * perpage;
    var max = (page_index * perpage > data.length) ? data.length : page_index * perpage;
    var ret = '';
    var id_array = new Array();

    if (ids) {
        id_array = ids.split(',');
    }

    for (var i = min; i < max; i++) {
        var isShow = true;

        for (var j = 0; j < id_array.length; j++) {

            if (id_array[j] == data[i].id) {
                isShow = false;
                break;
            }
        }
        if (isShow) {
            ret += dealComicDetailBlock(template, data[i]);
        }
    }
    return ret;
}

function dealSameComicBlock(maxPage, data, template, ids) {
    var min = 0;
    var id_array = new Array();
    id_array = ids.split(',');
    var dlen = data.length;
    var max = (maxPage + id_array.length) > dlen ? dlen : maxPage + id_array.length;
    var ret = new Array();
    ret['ids'] = '';
    ret['html'] = '';
    var count = 0;
    for (var i = min; i < max; i++) {
        if (count >= maxPage) {
            break;
        }
        var isShow = true;

        for (var j = 0; j < id_array.length; j++) {

            if (id_array[j] == data[i].id) {
                isShow = false;
                break;
            }
        }
        if (isShow) {
            count++;
            ret['ids'] += data[i].id + ',';
            ret['html'] += dealComicDetailBlock(template, data[i]);
        }
    }
    ret['ids'] = ret['ids'].substring(0, ret['ids'].length - 1);
    return ret;
}

function dealComicDetailBlock(tp, data) {
    var template = tp;
    template = template.replace('{{0}}', data.cover);
    template = template.replace('{{1}}', data.comic_url_raw);
    template = template.replace('{{2}}', data.comic_name);
    template = template.replace('{{3}}', data.comic_author);
    template = template.replace('{{4}}', data.status);
    template = template.replace('{{5}}', data.chapter_url_raw);
    template = template.replace('{{6}}', data.last_update_chapter_name);
    template = template.replace('{{7}}', data.comic_url_raw);
    template = template.replace('{{8}}', data.comic_name);
    template = template.replace('{{9}}', data.comic_name);
    template = template.replace('{{10}}', data.comic_name);
    template = template.replace('{{11}}', data.last_update_chapter_name);
    return template;
}

function generatePages(page_base, current_page, max_page_count) {
    var max_show = 9;
    current_page = parseInt(current_page);
    var min_page = current_page - 4 > 0 ? current_page - 4 : 1;
    var max_page = current_page + 4 < max_page_count ? current_page + 4 : max_page_count;
    var t = '?';
    if (page_base.indexOf('?') >= 0) {
        t = '&';
    }

    var str = '<a class="pselected" href="' + page_base + t + 'p=1">首页</a> ';
    if (current_page > min_page) {
        var pre_page = current_page - 1;
        str += '<a class="pselected" href="' + page_base + t + 'p=' + pre_page + '" >上一页</a> ';
    }

    for (var i = min_page; i <= max_page; i++) {
        if (i == current_page) {
            str += '<a  href="' + page_base + t + 'p=' + i + '">' + i + '</a> ';
        } else {
            str += '<a class="pselected" href="' + page_base + t + 'p=' + i + '">' + i + '</a> ';
        }
    }

    if (current_page < max_page) {
        var next_page = current_page + 1;
        str += '<a href="' + page_base + t + 'p=' + next_page + '" >下一页</a> ';
    }
    str += '<a class="pselected" href="' + page_base + t + 'p=' + max_page_count + '">末页</a> ';
    return str;
}

function getCookieValue(varname) {
    if (varname) {
        if (!document.cookie) {
            return '';
        }
        var a = document.cookie.indexOf(varname + "=");
        if (a != -1) {
            return document.cookie.substring((a + varname.length + 1), document.cookie.length).split(";")[0];
        } else {
            return "";
        }
    }
    return '';
}

function dechex(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }
    return parseInt(number, 10).toString(16)
}

var ACG_USER = new function () {
    this.getdir = function (uid) {
        var hex = dechex(uid);
        hex = new Array(9 - hex.length).join('0') + hex;
        var match = hex.match(/([\da-z]{2})([\da-z]{2})([\da-z]{2})([\da-z]{2})/);
        match.pop();
        match.shift();
        return match.join('/');
    };
    this.getfilename = function (uid, size) {
        if (!size) {
            size = 120
        }
        return size + '_' + uid + '.jpg';
    };
    this.getpatch = function (uid, size) {
        if (!size) {
            size = 120
        }
        return 'http://pic1.178.com/avatars/' + this.getdir(uid) + '/' + this.getfilename(uid, size);
    }
};


function getUserInfo() {

    var _178c = getCookieValue("my");

    var info = unescape(decodeURI(_178c)).split("|");

    if (info.length > 2 && info[2] != '') {
        info[3] = ACG_USER.getpatch(info[0]);
        return info;
    } else {

        return false;
    }

}

function generateUserBlock(userinfo) {
    return true;
    var template = '<div class="user_p_border">' +
        '<img width="48" height="48"  src="' + userinfo[3] + '"/>' +
        '</div><div class="mymessages">' +
        userinfo[2] + '<span class="icon_star"></span>' +
        '<a href="http://account.178.com/q_account.php?_act=logout" target="_self">退出</a> | ';


    if ($('.login').size() > 0) {
        $('.login').html(template + $('.login').html() + '</div>');
        $('#sms_info').show();
    }
}

function generateUserLogin() {
    return true;
    var html = '<div class="loginbtn"><form target="_self" method="POST" action="http://account.178.com/q_account.php" name="loginForm">' +
        '登录方式：<select name="type">' +
        '<option>用户名</option>' +
        '<option>UID</option>' +
        '<option>Email</option>' +
        '</select><span>用户名</span>：<input type="text" name="email" size="18" />' +
        '密码：<input type="password" name="password" size="18" />' + '<input type="hidden" name="_act" value="login"/>' +
        '<span class="i_input input"><input class="i_input" type="submit" value="登 陆" /> </span> <a href="http://account.178.com/?p=register">注 册</a> | <a href="http://account.178.com/?p=reset_pass">忘记密码</a> ' +
        '<input type="hidden" name="to" value="' + window.location.href + '" ></form></div><!--loginbtn-->';
    $('.login').html(html);
}

function getSTime(time, full) {
    var ret = '';
    var tmp = 0;
    var full_format = false;
    if (full && full == true) {
        full_format = true
    }

    if (time >= 1000 * 60 * 60 * 24) {
        tmp = Math.floor(time / (1000 * 60 * 60 * 24));

        if (full_format) {
            time -= tmp * 1000 * 60 * 60 * 24;
            ret += tmp + '天';
        } else {
            ret = tmp + '天';
            return ret;
        }
    }

    if (time >= 1000 * 60 * 60) {
        tmp = Math.floor(time / (1000 * 60 * 60));

        if (full_format) {
            time -= tmp * 1000 * 60 * 60;
            if (time > 0) {
                ret += tmp + '小时';
            }
        } else {
            ret = tmp + '小时';
            return ret;
        }
    }

    if (time >= 1000 * 60) {
        tmp = Math.floor(time / (1000 * 60));

        if (full_format) {
            time -= tmp * 1000 * 60;
            if (time > 0) {
                ret += tmp + '分钟';
            }
        } else {
            ret = tmp + '分钟';
            return ret;
        }
    }

    if (time >= 1000) {
        tmp = Math.floor(time / (1000));

        if (full_format) {
            ret += tmp + '秒';
        } else {
            ret = tmp + '秒';
            return ret;
        }
    }
    return ret;
}

function clearVisit(id) {
    $.cookie('_mh_visitedcomic', '', {expires: -1, path: '/', domain: '178.com'});
    if ($.cookie('_mh_visitedcomic')) {
        $.cookie('_mh_visitedcomic', '', {expires: -1, path: '/'});
    }

    if (id) {
        $('#' + id).html('');
    }
}

function getVisit() {
    var ret = new Array();
    var idx = 0;
    var name_value = $.cookie('_mh_visitedcomic');
    var time = (new Date()).getTime();

    if (name_value == null) {
        return null;
    } else {
        var ary = name_value.split("||");

        var url = window.location.href;
        var url_b = url.split('/');
        var size = url_b.length;
        var prefix = '';
        for (var j = 0; j < 3; j++) {
            prefix += url_b[j] + '/';
        }
        prefix += g_js_root;

        for (var i = ary.length - 1; i >= 0; i--) {
            var data = ary[i].split('###');
            var stime = 0;
            if (data.length == 3) {
                stime = time - parseInt(data[2]);
                stime = getSTime(stime) + '前';
                if (data[1] && typeof data[1] != 'undefined') {
                    ret[idx] = new Array(prefix + data[0], data[1], '', '', stime);
                    idx++;
                }
            }

            if (data.length == 5) {
                stime = time - parseInt(data[4]);
                stime = getSTime(stime) + '前';
                if (data[1] && typeof data[2] != 'undefined') {
                    ret[idx] = new Array(prefix + data[0], data[1], prefix + data[2], data[3], stime);
                    idx++;
                }
            }

        }
        return ret;
    }
}

function setVisit(url, name, url2, name2) {
    var time = (new Date()).getTime();
    var max_visited = 5;
    if (!url2) {
        setCookie('_mh_visitedcomic', url + '###' + name + '###' + time, max_visited);
    } else {
        setCookie('_mh_visitedcomic', url + '###' + name + '###' + url2 + '###' + name2 + '###' + time, max_visited);
    }
}

function setCookie(key, name, max_count) {
    if (!max_count) {
        max_count = 5;
    }
    var cname = name.substring(0, name.indexOf('###'));

    var name_value = $.cookie(key);
    if (name_value == null) {
        name_value = name;
    } else {
        var names = name_value.split("||");
        var tmp = '';
        var count = 0;
        for (var i = 0; i < names.length; i++) {
            var cpname = names[i].substring(0, names[i].indexOf('###'));
            if (cname != cpname) {
                tmp += '||' + names[i];
                count++;
            }
        }

        if (count >= max_count) {
            name_value = tmp.replace('||' + names[0] + '||', '') + '||' + name;
        } else {
            if (tmp != '') {
                name_value = tmp.substring(2) + '||' + name;
            } else {
                name_value = name;
            }
        }

    }
    // $.cookie(key, name_value, {expires: 7, path: '/',domain : '178.com'});
    $.cookie(key, name_value, {expires: 7, path: '/'});
}



function bookmark(title, url) {
    if (document.all) {
        window.external.AddFavorite(url, title)
    }
    else {
        if (window.sidebar) window.sidebar.addPanel(title, url, "")
    }
}

function copytoclipboard(copyingdata, alert_info) {
    if (window.clipboardData) {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", copyingdata);
        if (alert_info) {
            alert(alert_info);
        }
    } else {
        alert("此功能目前只支持IE浏览器")
    }
}

function loadVisitHistory() {
}

function genVisitPane(json_obj) {
    if (!window.uid || !json_obj || !json_obj.result) {
        $('#visited_comics').html("请登录后查看浏览记录");
        return;
    }
    if (!json_obj.data) return;
    //$('#more_visit').html('<a href="http://i.178.com/~analysis.index.list/type/1/uid/'+window.uid+'" target="_blank" class="blacklink">查看全部记录</a>');
    var visit_str = '<ul id="visited_comics">';
    for (var i = 0; i < json_obj.data.length; i++) {
        var v_comic_name = json_obj.data[i]['name'];
        var v_comic_url = g_s_url_prefix + 'mh/index.php?c=mjump&comic_id=' + json_obj.data[i]['id'];
        var v_chapter_name = json_obj.data[i]['last_view_chapter_name'];
        var v_chapter_url = json_obj.data[i]['last_view_chapter_url'];
        visit_str += '<li><span class="icoblueli"></span>';
        visit_str += '<a target="_blank" title="' + v_comic_name + '" href="' + v_comic_url + '" class="gray12link tt_comic0">' + v_comic_name + '</a>';
        visit_str += ' <a href="' + v_chapter_url + '" title="' + v_chapter_name + '" class="tt_chapter0" target="_blank">' + v_chapter_name + '</a>';
        visit_str += '</li>';
    }
    visit_str += '</ul>';
    $('#visit_panel').html(visit_str);
}

function loadNotice() {
    var url = "//interface.dmzj.com/comic/notice";
    var tuijianid = 69;
    $.ajax({
        type: 'get',
        url: url,
        cache: false,
        dataType: 'jsonp',
        jsonpCallback: 'sucess_webNotice',
        data:"tuijianid="+tuijianid ,
        timeout: 30000,
        success: function (json) {
            var html = '';
            if(json != ""){
                for(var i=0; i<json.length;i++){
                    html +='<li><span class="tip"></span><a class="book_title" href="'+json[i].url+'" target="_blank">'+json[i].title+'</a></li>';
                }
                $("#notice_panel").html(html)
            }
        }
    });
}

var _VisitPanel = {
    subReadArray: new Array(),
    init: function () {
        loadNotice()
        this.bindTabEvent();
        this.checkSubUpdate();
    },
    bindTabEvent: function () {
        $('.history_tab').mouseover(function () {
            $('.history_tab').removeClass('s-nav3');
            $(this).addClass('s-nav3');
            var target_div = $(this).attr('target_div');
            $('.history_list_div').hide();
            $('#' + target_div).show();
        });
    },
    loadSubscribe: function () {
        if (!window.uid) {
            $('#visit_panel').html("请登录后查看浏览记录");
            $('#subscribe_panel').html("请登录后查看订阅漫画");
            return;
        }
        var url = "//user.dmzj.com/subscribe/getsubscribe/mh?" + (new Date()).getTime();
        var s = "<script type='text/javascript' src='" + url + "'></script>";
        $('body').append(s);
    },
    genVisitPanel: function (json_obj) {

        if (!window.uid) {
            $('#visit_panel').html("请登录后查看浏览记录");
            return;
        }

        if (!json_obj) return;

        if (!json_obj.result) {
            $('#visit_panel').html('您还没有任何浏览记录');
            return;
        }
        var visit_str = '<ul id="visited_comics">';
        for (var i = 0; i < json_obj.data.length; i++) {
            alert(json_obj.data[i]['last_view_chapter_name']);
            if (!json_obj.data[i]['name'] || !json_obj.data[i]['id'] || !json_obj.data[i]['last_view_chapter_name']) continue;

            var v_comic_name = json_obj.data[i]['name'];
            var v_comic_url = g_s_url_prefix + 'mh/index.php?c=mjump&comic_id=' + json_obj.data[i]['id'];
            var v_chapter_name = json_obj.data[i]['last_view_chapter_name'];
            var v_chapter_url = json_obj.data[i]['last_view_chapter_url'];
            visit_str += '<li><span class="icoblueli"></span>';
            visit_str += '<a target="_blank" title="' + v_comic_name + '" href="' + v_comic_url + '" class="gray12link tt_comic0">' + v_comic_name + '</a>';
            visit_str += '<a href="' + v_chapter_url + '" title="' + v_chapter_name + '" class="tt_chapter0" target="_blank">' + v_chapter_name + '</a>';
            visit_str += '</li>';
        }
        if (json_obj.data.length < 1) {
            visit_str += '您还没有任何浏览记录';
        }
        visit_str += '</ul>';
        if (json_obj.data.length > 0) {
            //visit_str += '<ul style="text-align:right"><a href="http://i.178.com/~analysis.index.list/type/1/" class="update_link">查看更多浏览记录..</a></ul>';
        }
        $('#visit_panel').html(visit_str);
    },
    genSubscribePanel: function (json_obj) {
        if (!window.uid || !json_obj) {
            $('#subscribe_panel').html("请登录后查看订阅漫画");
            return;
        }
        if (!json_obj.data || !json_obj.data.length) return;
        window.json_data = json_obj.data;
        var subscribe_str = '<ul>';
        for (var i = 0, j = json_obj.data.length; i < j; i++) {
            if (!json_obj.data[i]['sub_name']) continue;
            if (!json_obj.data[i]['sub_id']) continue;
            var s_comic_name = json_obj.data[i]['sub_name'];
            var s_comic_url = json_obj.data[i]['sub_id_url'];
            var s_chapter_name = json_obj.data[i]['sub_update'];
            var s_chapter_url = json_obj.data[i]['sub_url'];
            var s_comic_id = json_obj.data[i]['id'];
            var is_new = (0 === parseInt(json_obj.data[i]['sub_readed']));
            var click_event_str = ' onclick="_VisitPanel.noticeRead(' + s_comic_id + ');" ';
            subscribe_str += '<li><span class="icoblueli"></span>';
            subscribe_str += '<a target="_blank" ' + (is_new ? click_event_str : '' ) + '  title="' + s_comic_name + '" href="' + s_comic_url + '" class="gray12link tt_comic1">' + s_comic_name + '</a>';
            subscribe_str += '<a href="' + s_chapter_url + '" ' + (is_new ? click_event_str : '' ) + ' title="' + s_chapter_name + '" class="tt_chapter0" target="_blank">' + s_chapter_name + '</a>';
            if (is_new) {
                subscribe_str += '&nbsp;<span class="tt_chapter1 color_red">new!</span>';
            }
            subscribe_str += '</li>';
        }
        if (json_obj.data.length < 1 || !json_obj.data[0]['sub_name']) {
            subscribe_str += '您还未订阅任何漫画';
        }

        subscribe_str += '</ul>';
        if (json_obj.data.length > 0 && json_obj.data[0]['sub_name']) {
            subscribe_str += '<ul style="text-align:right"><a href="//i.dmzj.com/subscribe" class="update_link">查看更多订阅漫画..</a></ul>';
        }
        $('#subscribe_panel').html(subscribe_str);
    },
    checkSubUpdate: function () {
        _VisitPanel.inter_run_time = 0;
        this.t_handler = setInterval(function () {
            _VisitPanel.inter_run_time++;
            if (_VisitPanel.inter_run_time > 200) {
                clearInterval(_VisitPanel.t_handler);
            }
            if (!window.___json___) return;
            if (!window.___json___.data) return;
            var sys_msg = window.___json___;
            if (sys_msg.result && sys_msg.data) {
                if (sys_msg.data.cartoon && sys_msg.data.cartoon > 0) {
                    $('#sub_update_tip').html(sys_msg.data.cartoon);
                    $('#sub_update_tip').addClass('dynew');
                    $('#sub_update_tip').show();
                    clearInterval(_VisitPanel.t_handler);
                    return;
                }
            }
        }, 500);
    },
    noticeRead: function (comic_id) {
        if (!comic_id) return;
        for (var i = 0, j = this.subReadArray.length; i < j; i++) {
            if (comic_id === this.subReadArray[i]) return;
        }
        //var notice_api_script = '<scr'+'ipt type="text/javascript" src="http://i.178.com/~subscribe.index.setReaded/res_id/'+comic_id+'/res_type/1"></scr'+'ipt>';
        var notice_api_script = '<scr' + 'ipt type="text/javascript" src="//user.dmzj.com/subscribe/indexsubscribe/' + comic_id + '"></scr' + 'ipt>';
        $('body').append(notice_api_script);
        this.subReadArray.push(comic_id);
    }
}

function subString(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        }
        else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}

function md5(string){
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function md5_AddUnsigned(lX,lY){
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x,y,z){
        return (x & y) | ((~x) & z);
    }
    function md5_G(x,y,z){
        return (x & z) | (y & (~z));
    }
    function md5_H(x,y,z){
        return (x ^ y ^ z);
    }
    function md5_I(x,y,z){
        return (y ^ (x | (~z)));
    }
    function md5_FF(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function md5_WordToHex(lValue){
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for(lCount = 0;lCount<=3;lCount++){
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string){
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=md5_AddUnsigned(a,AA);
        b=md5_AddUnsigned(b,BB);
        c=md5_AddUnsigned(c,CC);
        d=md5_AddUnsigned(d,DD);
    }
    return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}

function error_report(obj) {
    var user_info = getUserInfo();
    user_title = '';
    if (!user_info) {
        alert('请您登录后在进行操作');
        return false;
    }
    var error_content = '<p>' + g_comic_name + ' ' + g_chapter_name + '漫画观看有问题</p><p>链接为：' + location.href + '</p><p>出现的问题：</p>';
    error_content = encodeURIComponent(error_content);
    obj.href = 'http://i.178.com/~sms.index.view_send_form/reciever/%E9%95%B7%E7%80%AC%E6%B9%8A/uid/2600003/content/' + error_content;
    return true;
}

var datas = $.cookie('my');
if (datas != null && datas != '') {
    var t = datas.split('|')
    var uid = t[0];
} else {
    var uid = 0;
}
