<?php
    require_once ('webSpider.php');
    $webs=new webSPider();
    if($_REQUEST["choose"])
    {
        //如果choose是1那么就是提交评论
        //如果是0那么就是显示评论
        if($_REQUEST["choose"]==1)
        {
            //把获取到的数据方方放入数组中
            $arr['openid']=addslashes($_REQUEST["openid"]);
            $arr['nickname']=addslashes($_REQUEST["nickname"]);
            $arr['comment']=addslashes($_REQUEST["comment"]);
            $arr['usr_img']=addslashes($_REQUEST["usrImg"]);
            $arr['web_url']=addslashes($_REQUEST["webUrl"]);
            echo $webs->submitComment($arr);

        }
        else if ($_REQUEST["choose"]==2)
        {
            $arr=$webs->getComments($_REQUEST["url"]);               //获取array数据
            header('Content-Type:application/json; charset=utf-8');    //对数据进行编码
            exit(json_encode($arr));//编码后返回数据
        }else if($_REQUEST["choose"]==3)//如果choose是3，那么就返回专题文章
        {
            $arr=$webs->getCategoryPage($_REQUEST["url"],$_REQUEST["id"]);                     //获取array数据
            header('Content-Type:application/json; charset=utf-8');    //对数据进行编码
            exit(json_encode($arr));//编码后返回数据
        }else if($_REQUEST["choose"]==4)//如果choose是4，那么就返回openID
        {
            echo $webs->getOpenId($_REQUEST["resCode"]);                     //获取array数据
        }else if($_REQUEST["choose"]==5)//如果choose是5，就返回日记
        {
            $arr=$webs->getDiary($_REQUEST["id"]);                     //获取array数据
            header('Content-Type:application/json; charset=utf-8');    //对数据进行编码
            exit(json_encode($arr));//编码后返回数据
        }

    }else if($_REQUEST["id"])
    {
        $arr=$webs->getIndexPage($_REQUEST["id"]);                     //获取array数据
        header('Content-Type:application/json; charset=utf-8');    //对数据进行编码
        exit(json_encode($arr));//编码后返回数据
    }
    else if($_REQUEST["url"])
    {
        $code=1;
        if($_REQUEST["code"]) $code=$_REQUEST["code"];
        $arr=$webs->getPageContent($_REQUEST["url"],$code);                     //获取array数据
        header('Content-Type:application/json; charset=utf-8');    //对数据进行编码
        exit(json_encode($arr));//编码后返回数据
    }