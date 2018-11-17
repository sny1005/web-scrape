var __HOST__ = {
    img_prefix: "http://img.dmzj.com",
    is_hot_comic: false,
    is_fast_comic: false,
    cfg: {
        comic_site_host: "//manhua.dmzj.com",
        fast_img_host: "//images.dmzj.com",
        fast_tel_img_host: "//images.dmzj.com",
        fast_cnc_img_host: "//images.dmzj.com",
        fast_img_host1: "//images.dmzj.com",
        fast_tel_img_host1: "//images.dmzj.com",
        fast_cnc_img_host1: "//images.dmzj.com",
        tel_img_host: "//images.dmzj.com",
        cnc_img_host: "//images.dmzj.com",
        hot_img_host: "http://hot.dmzj.com",
        img_host: "//images.dmzj.com"
    },
    genImgPrefix: function (isp) {
        var img_prefix = '';
        if (!this.is_fast_comic && !this.is_hot_comic) {
            switch (isp) {
                case 'auto':
                    img_prefix = this.cfg.img_host;
                    break;
                case 'tel':
                    img_prefix = this.cfg.tel_img_host;
                    break;
                case 'cnc':
                    img_prefix = this.cfg.cnc_img_host;
                    break;
                default :
                    img_prefix = this.cfg.img_host;
                    break;
            }
        }
        if (this.is_fast_comic) {
            switch (isp) {
                case 'auto':
                    img_prefix = (server_name) ? this.cfg.fast_img_host1 : this.cfg.fast_img_host;
//									img_prefix = this.cfg.fast_img_host;	
                    break;
                case 'tel':
                    img_prefix = (server_name) ? this.cfg.fast_tel_img_host1 : this.cfg.fast_tel_img_host;
//									img_prefix = this.cfg.fast_tel_img_host;	
                    break;
                case 'cnc':
                    img_prefix = (server_name) ? this.cfg.fast_cnc_img_host1 : this.cfg.fast_cnc_img_host;

//									img_prefix = this.cfg.fast_cnc_img_host;	
                    break;
                default :
                    img_prefix = (server_name) ? this.cfg.fast_img_host1 : this.cfg.fast_img_host;
//									img_prefix = this.cfg.fast_img_host; 	
                    break;
            }
        }
        if (this.is_hot_comic) {
            img_prefix = this.cfg.hot_img_host;
        }
        if ((!isp || isp == 'auto') && location.href.indexOf('manhua189.178.com') != -1) {
            img_prefix = "http://manhua189.178.com/imgs";
        }
        img_prefix += '/';
        return img_prefix;
    },
    init: function () {
        var isp_type = $.cookie('_isp_type');
        class_flag = false;
        if (!isp_type || isp_type == 'auto') {
            $('#default_server').addClass('on');
            class_flag = true;
        } else {
            $('.switchServer').each(function () {
                if (isp_type === $(this).attr('isp_type')) {
                    $(this).addClass('on');
                    class_flag = true;
                }
            });
        }
        if (!class_flag) {
            $('#default_server').addClass('on');
        }
        this.is_fast_comic = window.is_fast_comic;
        window.img_prefix = this.img_prefix = this.genImgPrefix(isp_type);
    }
};


function nextChapterMsgBox() {
    $('#transit_div').css('height', $(document).height());
    var transit_div = $('#transit_div');
    var internal_div = $('#internal_div');
    transit_div.show();
    internal_div.show();
    internal_div.css('margin-top', $(document).scrollTop() + 150 + 'px');
    $(window).scroll(function () {
        if (internal_div) {
            internal_div.css('margin-top', $(document).scrollTop() + 150 + 'px');
        }

    });
    $('#close_btn').unbind("click");
    $('#close_btn').bind("click", function () {
        $("#transit_div").hide();
        $("#internal_div").hide();
    });
    $('#next_btn').unbind("click");
    $('#next_btn').bind("click", function () {
        $("#transit_div").hide();
        $("#internal_div").hide();
        window.location.href = $('#next_chapter').attr('href');
    });
    $('#go_sns_view_input').unbind("click");
    $('#go_sns_view_input').bind("click", function () {
        $("#transit_div").hide();
        $("#internal_div").hide();
    });
    $('#next_btn').focus();
}


//var app_html='<div id="app_manhua" style="width:800px; height:120px; padding:20px; background:#fff; display:block; border:1px solid #ccc; margin:20px auto"><iframe id="ac_im86_58502791" name="ac_im86_58502791" src="//afpeng.alimama.com/ex?a=mm_115547023_13540163_58502791&sp=0&cb=_acM.r" width="800" height="120" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true"></iframe></div>';

var app_html = '<div id="app_manhua" style="width:800px; height:120px; padding:20px; background:#fff; display:block; border:1px solid #ccc; margin:20px auto"></div>'

var arr_pages_length = arr_pages.length;
var img_prefix= "//images.dmzj.com/";

//纵向显示
function getImg(arr_pages){
    var prevChapter = $("#prev_chapter").size()>0?'<a class="btm_chapter_btn fl" href="'+$("#prev_chapter").attr("href")+'">上一章节</a>':'';
    var nextChapter = $("#next_chapter").size()>0?'<a class="btm_chapter_btn fr" href="'+$("#next_chapter").attr("href")+'">下一章节</a>':'';
    var htmlStr='';
    for(var i=0;i<arr_pages.length;i++){
        htmlStr+='<DIV class="inner_img"  style="margin-top:40px">';
        htmlStr += '<a style="cursor:pointer" name="page='+(i+1)+'" index="'+(i+1)+'" >';
        htmlStr += '<img id=img_'+(i+1)+' style="border:1px solid #ccc; padding:1px" data-original="'+img_prefix+arr_pages[i]+'">';
        htmlStr += '</a><p class="curr_page">'+parseInt(i+1)+'/'+g_max_pic_count+'</p></DIV>';
        htmlStr += '</div>';
    }
    var btnBntHtml = '<div class="btmBtnBox">';
        btnBntHtml +=prevChapter;
        btnBntHtml +=nextChapter;
        btnBntHtml +='</div>';
    $("#center_box").html(htmlStr).after(app_html);
    $("#app_manhua").after(btnBntHtml);
    if($(".btm_chapter_btn").size()==1){
        $(".btmBtnBox").width(200)
    }
    historyCookie(g_comic_id,sns_sys_id.split("_")[1],1);
}


var img1=new Image();
var img_src = '';



//横向显示
function getImg_land(arr_pages){
    if(document.location.hash==false){
        document.location.hash = '@page=1';
        var his_img = 1;
    }else{
        var his_img = document.location.hash.split("=")[1];
    }
    //var his_img = document.location.hash.split("=")[1];
    var prevChapter = $("#prev_chapter").size()>0?'<a class="btm_chapter_btn fl" href="'+$("#prev_chapter").attr("href")+'">上一章节</a>':'';
    var nextChapter = $("#next_chapter").size()>0?'<a class="btm_chapter_btn fr" href="'+$("#next_chapter").attr("href")+'">下一章节</a>':'';
    var img_src = img_prefix + arr_pages[his_img-1];
    var img = '<img name="page_'+his_img+'" src="'+img_src+'"/>';
    var select_option ='';
    for(var i=0; i<arr_pages.length; i++){
        select_option+='<option value="'+img_prefix+arr_pages[i]+'">第'+(i+1)+'页</option>';
    }
    var select_h = '<select name="select" id="page_select" onchange="select_page()">'+select_option+'</select>';
    $("#center_box").css("position","relative");
    $("#center_box").append(img);
    $("#center_box").append('<a class="img_land_prev"  onclick="prev_img(this)"></a><a class="img_land_next" onclick="next_img(this)"></a>');
    $("#center_box").after(app_html);
    $("#app_manhua").after('<div class="btmBtnBox">'+prevChapter+select_h+nextChapter+'</div>');
    $("#page_select option").eq(his_img-1).attr("selected","selected");

    imgload_size();
    if ($('#next_chapter').size()==0){
        $(".btmBtnBox").css("width","256px")
    }
    historyCookie(g_comic_id,sns_sys_id.split("_")[1],his_img);
}

function select_page(){
    var options=$("#page_select option:selected").val();
    var _index = $("#page_select option:selected").index()+1;
    var imgStr = '<img src="'+options+'"/>';
    $("#center_box").find("img").remove();
    $("#center_box").append(imgStr);
    $("#center_box").find("img").attr("name","page_"+(_index));
    curr_page =_index;
    historyCookie(g_comic_id,sns_sys_id.split("_")[1],curr_page);
    document.location.hash = '@page='+_index;
    $("html,body").animate({
        "scrollTop": $("#center_box").offset().top
    },0)
}
function prev_img(obj){
    var obj_img_src = $("#center_box").find("img").attr("src");
    for(var i=0; i<arr_pages.length;i++){
        var img_src = img_prefix+arr_pages[i];
        if(obj_img_src==img_src){
            if(img_prefix+arr_pages[i-1]!="//images.dmzj.com/undefined"){
                var imgStr = '<img src="'+img_prefix+arr_pages[i-1]+'"/>';
                $("#center_box").find("img").remove();
                $("#center_box").append(imgStr);
                curr_page=parseInt(i);
                historyCookie(g_comic_id,sns_sys_id.split("_")[1],curr_page);
                if ($('.zoompic_chk').is(':checked')){
                    imgload_size();
                }
                $("#center_box").find("img").attr("name","page_"+(i-1));
                $(".turnPage").html(parseInt(i)+"/"+g_max_pic_count);
                $("#page_select option").eq(i-1).attr("selected","selected");
                document.location.hash='@page='+(i);
                $("html,body").animate({
                    "scrollTop": $("#center_box").offset().top
                },0)
            }else{
                if($("#prev_chapter").size()>0){
                    if(confirm("已经是此章节第1页了，要打开上一个章节吗？")==true){
                        location.href = $("#prev_chapter").attr("href");
                    }
                }else{
                    alert("已经是第一个章节了！");
                }
            }
            break
        }
    }
}


function next_img(obj){
    var obj_img_src = $("#center_box").find("img").attr("src");
    for(var i=0; i<arr_pages.length;i++){
        var img_src = img_prefix+arr_pages[i];
        if(obj_img_src==img_src){
            if(img_prefix+arr_pages[i+1]!="//images.dmzj.com/undefined"){
                var imgStr = '<img src="'+img_prefix+arr_pages[i+1]+'"/>';
                $("#center_box").find("img").remove();
                $("#center_box").append(imgStr);
                curr_page=parseInt(i)+2;
                historyCookie(g_comic_id,sns_sys_id.split("_")[1],curr_page);
                if ($('.zoompic_chk').is(':checked')){
                    imgload_size();
                }
                $(".turnPage").html(parseInt(i+2)+"/"+g_max_pic_count);
                $("#page_select option").eq(i+1).attr("selected","selected");
                $("#center_box").find("img").attr("name","page_"+(i+2));
                if(img_prefix+arr_pages[i+2]!="//images.dmzj.com/undefined"){
                    img1.src = img_prefix+arr_pages[i+2];
                }
                document.location.hash='@page='+(i+2);
                $("html,body").animate({
                    "scrollTop": $("#center_box").offset().top
                },0)
            }else{
                if ($('#next_chapter').size()>0){
                    nextChapterMsgBox()
                }else{
                    window.location.href=final_page_url;
                    $(".btmBtnBox").css("width","256px")
                }
            }
            break
        }
    }
}

function imgload_size(){
    $("#center_box").find("img").load(function(){
        var w = $(window).width();
        var img_w = $(this).width();//图片宽度
        var img_h = $(this).height();
        if(img_w>w){//如果图片宽度超出容器宽度--要撑破了
            var height = (w*img_h)/img_w; //高度等比缩放
            $(this).css({"width":w-4,"height":height});//设置缩放后的宽度和高度
        }
    });
}

function historyLog(historyJson){
    if($.cookie('my') != null){
        var userId = $.cookie('my').split("|")[0];
        $.ajax({
            type: "get",
            url: "//interface.dmzj.com/api/record/getRe",
            dataType: "jsonp",
            jsonp: 'callback',
            jsonpCallback: "record_jsonpCallback",
            data: {uid:userId,type:1,st:"comic",json:historyJson},
            success: function (e) {
            }
        });
    }
}

function historyCookie(comic_Id,chapter_id,curr_Page){
    if($.cookie('my') == null){
        return false
    }
    var cookieData = Date.parse(new Date()).toString().substr(0,10);
    if($.cookie("history_CookieR")==undefined){
        var item_obj = {};
        item_obj[comic_Id] = chapter_id;
        item_obj["comicId"] = comic_Id;//漫画id
        item_obj["chapterId"] = chapter_id;//话id
        item_obj["page"] = curr_Page;//第几页
        item_obj["time"] =cookieData//观看时间
        $.cookie("history_CookieR", JSON.stringify([item_obj]),{path:"/",expires: 99999});
    }else{
        var cookie_obj = $.parseJSON($.cookie("history_CookieR"));
        var exist = false;
        for(var i=0;i<cookie_obj.length;i++) {
            var obj = cookie_obj[i];
            if(obj[comic_Id]) {
                obj[comic_Id] = chapter_id;//漫画id
                obj["comicId"] = comic_Id;//漫画id
                obj["chapterId"] = chapter_id;//漫画id
                obj["page"] = curr_Page;//漫画页数
                obj["time"] = cookieData; //观看时间
                exist = true;
                break;
            }
        }
        if(!exist) {
            var item_obj = {};
            item_obj[comic_Id] = chapter_id;
            item_obj["comicId"] = comic_Id;//漫画id
            item_obj["chapterId"] = chapter_id;//漫画id
            item_obj["page"] = curr_Page;
            item_obj["time"] =cookieData;
            cookie_obj.push(item_obj);
        }
        $.cookie("history_CookieR", JSON.stringify(cookie_obj),{path:"/",expires: 99999});
    }

}

setInterval(function (){
    if($.cookie("history_CookieR")!=undefined){
        historyLog($.cookie("history_CookieR"));
    }
    $.cookie("history_CookieR", null,{path:"/"});
},30000);

function doHit() {
    var str = "<script src=\"//sacg.dmzj.com/comicsum/comicshot.php?i="+g_comic_id+"&cid="+g_chapter_id+"&signature="+md5("/comicsum/comicshot.php?i="+g_comic_id+"&cid="+g_chapter_id)+"\"></script>";
    $('body').append(str);
}

$(function () {
    if($.cookie('display_mode')==null || $.cookie('display_mode')==0){
        getImg_land(arr_pages);
        $("#qiehuan_txt").html("切换到上下滚动阅读");
        $.cookie('display_mode',0,{expires:999999,path:'/'});
        window.onhashchange=function(){
            var his_img = document.location.hash.split("=")[1];
            $("#center_box").find("img").attr("src",img_prefix+arr_pages[his_img-1]);
            $("#page_select option").eq(his_img-1).attr("selected","selected");
        };
        $("body").keydown(function(event) {
            if (event.keyCode == 37) {
                 prev_img(".img_land_prev")

            } else if (event.keyCode == 39) {

                 next_img(".img_land_next")

            }
        })
    }else{
        $("#qiehuan_txt").html("切换到左右翻页阅读");
        getImg(arr_pages);
        //点击进入下一张
        $(".inner_img a").click(function(){
            var _index=$(this).attr("index");
            if(_index<g_max_pic_count){
                window.location.href="#page="+(parseInt(_index)+parseInt(1));
            }else{
                if ($('#next_chapter').size()>0){
                    nextChapterMsgBox()
                }else{
                    window.location.href=final_page_url;
                }
            }
        });

        //绑定滚动条事件
        /*$(window).bind('scroll', function(){
            var documentHeight = $("#center_box").height();
            var documentScrollTop = $(document).scrollTop()-350;
            var index = Math.round(($(".inner_img").length) * documentScrollTop / documentHeight);
            document.location.hash = "@page="+(index+1);
        });*/

        $("#center_box img").load(function(){
            setWidth()
        }).lazyload({
            placeholder : "https://static.dmzj.com/ocomic/images/mh-last/lazyload.gif",
            effect: "fadeIn",
            threshold:2000
        })

        $("body").keydown(function(event) {
            if (event.keyCode == 37) {
                if($("#prev_chapter").size()>0){
                    if(confirm("要打开上一个章节吗？")==true){
                        location.href = $("#prev_chapter").attr("href");
                    }
                }else{
                    alert("已经是第一个章节了")
                }
            } else if (event.keyCode == 39) {
                if($("#next_chapter").size()>0){
                    nextChapterMsgBox()
                }else{
                    window.location.href=final_page_url;
                }

            }
        })
    };
    doHit();
    $(document).bind("contextmenu",function(){
        return false;
    });

    if($(".btm_chapter_btn").size()==1){
        $(".btmBtnBox").css("width","256px")
    }
});

function qiehuan(obj){
    if($.cookie('display_mode')==0){
        $.cookie('display_mode',1,{expires:999999,path:'/'});
    }else{
        $.cookie('display_mode',0,{expires:999999,path:'/'});
    }
    location.reload();
}




/*if($.cookie('big_size')==null){
    $.cookie('big_size', false, { path: page_site_root});
}*/


$('.zoompic_chk').click(function () {
    $('.zoompic_chk').attr('checked', $(this).prop('checked'));
    if ($('.zoompic_chk').is(':checked')){
            setWidth();
        img_zoom_flag = false;
    }else{
        $("#center_box img").each(function () {
            resizeImg(img_zoom_flag, this);
        });
        img_zoom_flag = true;
    }
});

/*设置图片自适应宽度*/
function setWidth(){
    var w = $(window).width();//容器宽度
    $("#center_box img").each(function(){
        var img_w = $(this).width();//图片宽度
        var img_h = $(this).height();//图片高度
        if(img_w>w){//如果图片宽度超出容器宽度--要撑破了
            var height = (w*img_h)/img_w; //高度等比缩放
            $(this).css({"width":w-4,"height":height});//设置缩放后的宽度和高度
        }
    })
}


function resizeImg(flag, obj){
    this.img_orgin_width = obj.naturalWidth;
    this.img_orgin_height = obj.naturalHeight;
    if (!$('.zoompic_chk').length) {
        return false;
    }
    //var browser = getBrowser();
    var target_img = $(obj);

    if (flag) {
        //var body_width = browser.ie ?  $(window).width() : $(document.body).outerWidth(false);
        var body_width = $(window).width();
        body_width -= 4;
        var ratio = body_width / this.img_orgin_width;
        if (ratio >= 1) {
            return;
        }
        var zoom_img_height = this.img_orgin_height * ratio;
        var zoom_img_width = this.img_orgin_width * ratio;
        target_img.height(zoom_img_height + "px");
        target_img.width(zoom_img_width + "px");
        return;
    } else {
        ratio = 1;
        var zoom_img_height = this.img_orgin_height * ratio;
        var zoom_img_width = this.img_orgin_width * ratio;
        target_img.height(zoom_img_height + "px");
        target_img.width(zoom_img_width + "px");

        return;
    }
}


