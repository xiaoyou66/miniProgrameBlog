<?php
include 'phpQuery/phpQuery.php';
class webSPider
{
    public $title=array();//标题
    public $image_url=array();//图片链接
    public $detail=array();//详情介绍
    public $create=array();//创建时间
    public $visits=array();//浏览数
    public $likes=array();//点赞数
    public $comments=array();//评论数
    public $urls=array();//文章链接
    public $pages;//总页数
    //这里是数据库的一些信息
    private $servername="localhost";
    private $host="3306";
    private $username="数据库用户名";
    private $db_name="数据库名字";
    private $passwd="数据库密码";
    private $table_name="数据表名字";
    //微信小程序的信息
    private $appId="APPID";
    private $secret="秘钥文件";


    //把解析到的内容转换成文章
    private function changeWebInArray($output){
        phpQuery::newDocument($output);
        //获取文章页数
        $page=pq(".pagination>li:last>a")->attr('href');//对获取到的内容进行处理
        $page=substr($page,0,strlen($page)-1);//截取字符然后获得总页数
        $pos=strripos($page,"/");
        $this->pages=substr($page,$pos+1);//这里是获取总页数，这里不同的网站可能需要自己修改一下代码，不过应该是都可以适用的
        //获取文章标题
        foreach(pq(".kratos-entry-border-new>div>div>header>h2>a") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            array_push($this->title,$li->textContent);
        }
        //获取文章内容
        foreach(pq(".kratos-entry-border-new>div>div>p") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            array_push($this->detail,$li->textContent);
        }
        //获取图片链接
        foreach(pq(".kratos-entry-border-new>.kratos-post-inner-new") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            $urls=substr(pq($li)->attr('style'),22);
            $urls=substr($urls,0,strlen($urls)-3);//截取字符然后获得总页数
            array_push($this->image_url,$urls); //phpquery也可以这样使用
        }
        //获取文章写的日期
        $i=1;
        foreach(pq(".kratos-entry-border-new>.kratos-post-meta-new>.pull-left>a") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            $text=pq($li)->text();
            switch ($i%5)
            {
                case 1:
                    array_push($this->create,$text); //phpquery也可以这样使用
                    break;
                case 3:
                    array_push($this->visits,$text); //phpquery也可以这样使用
                    break;
                case 2:
                    array_push($this->comments,$text);  //phpquery也可以这样使用
                    break;
                case 4:
                    array_push($this->likes,$text); //phpquery也可以这样使用
                    break;
            }
            $i++;
        }
        //获取文章的链接
        foreach(pq(".kratos-entry-border-new>div>div>header>h2>a") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            array_push($this->urls,pq($li)->attr('href'));

        }

        //这里生成数据，把获取到的数据放入一个新的数组中，形成一个二维数组
        $arr=Array();
        $arr['pages']=$this->pages;
        $arr['title']=$this->title;
        $arr['imgUrl']=$this->image_url;
        $arr['detail']=$this->detail;
        $arr['create']=$this->create;
        $arr['visits']=$this->visits;
        $arr['likes']=$this->likes;
        $arr['comments']=$this->comments;
        $arr['urls']=$this->urls;
        return $arr;
    }

    //获取首页文章
    public function getIndexPage($id)
    {
        if($id==1)
            $url="https://xiaoyou66.com";
        else
            $url="https://xiaoyou66.com/page/$id/";
        $ch = curl_init(); //初始化curl模块
        curl_setopt($ch, CURLOPT_URL, $url); //登录提交的地址
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);//这个很关键就是把获取到的数据以文件流的方式返回，而不是直接输出
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //发送请求头
        "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
        "Referer: https://xiaoyou66.com/",
        ));
        $output=curl_exec($ch);
        curl_close($ch);//关闭连接
        return $this->changeWebInArray($output);
    }
    //获取分类文章的内容
    public function getCategoryPage($url,$id)
    {
        if($id!=1) $url=$url."page/$id/";
        $ch = curl_init(); //初始化curl模块
        curl_setopt($ch, CURLOPT_URL, $url); //登录提交的地址
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);//这个很关键就是把获取到的数据以文件流的方式返回，而不是直接输出
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //发送请求头
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
            "Referer: https://xiaoyou66.com/",
        ));
        $output=curl_exec($ch);
        curl_close($ch);//关闭连接
        return $this->changeWebInArray($output);
    }

    //获取文章内容
    public function getPageContent($url,$code)
    {
        //如果code为1，那么就需要转码，否则就不需要
        if($code==1)
        {
            $url=substr($url,22);
            $url=substr($url,0,strlen($url)-1);
            $url=urlencode($url);
            $url="https://xiaoyou66.com/".$url."/";
        }
        //return $url;
        $ch = curl_init(); //初始化curl模块
        curl_setopt($ch, CURLOPT_URL, $url); //登录提交的地址
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);//这个很关键就是把获取到的数据以文件流的方式返回，而不是直接输出
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //发送请求头
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
            "Referer: https://xiaoyou66.com/",
            ""
        ));
        $output=curl_exec($ch);
        curl_close($ch);//关闭连接
        phpQuery::newDocument($output);
        $html=pq(".kratos-post-content")->html();//获取文章内容
        return $html;
    }

    //提交评论到数据库上
    public function submitComment($arr)
    {
        //这里我就不写判断了，直接插入就是了
        $value="\"".$arr["openid"]."\",\"".$arr["nickname"]."\",\"".$arr["comment"]."\",NOW(),\"".$arr["usr_img"]."\",\"".$arr["web_url"]."\"";
        //连接数据库
        $sql="INSERT INTO  ".$this->table_name ."(openid,nickname,comment,comment_time,usr_img,web_url) VALUES ($value);";
        $mysql=new MySQLi($this->servername,$this->username,$this->passwd,$this->db_name,$this->host);
        if($mysql -> connect_errno){
            die('连接错误' . $mysql -> connect_error);
        }
        //设置编码
        $mysql->set_charset("utf8");
        //执行语句
        $res=$mysql->query($sql);
        $mysql-> close();
        //return $res;
        if($res)
        {
            //执行成功后的操作
            return "ok";
        }
        else
        {
            return "error";
        }
    }
    //获取数据库的评论
    public function getComments($url)
    {
        $sql="SELECT * FROM `commment` WHERE web_url=\"$url\"";
        $mysql=new MySQLi($this->servername,$this->username,$this->passwd,$this->db_name,$this->host);
        if($mysql -> connect_errno){
            die('连接错误' . $mysql -> connect_error);
        }
        //设置编码
        $mysql->set_charset("utf8");
        //执行语句
        $res=$mysql->query($sql);
        $result=array();
        //这里是不断的把数据给输出来，然后加到数组中去
        while($row=$res->fetch_row())
        {
            array_push($result,$row);
        }
        $res->free();
        $mysql-> close();
        return $result;
    }
    //获取openid
    public function getOpenId($resCode)
    {
        $url="https://api.weixin.qq.com/sns/jscode2session?appid=$this->appId&secret=$this->secret&js_code=$resCode&grant_type=authorization_code";
        $ch = curl_init(); //初始化curl模块
        curl_setopt($ch, CURLOPT_URL, $url); //登录提交的地址
        $output=curl_exec($ch);
        $output=substr($output,0,strlen($output)-1);//截取字符然后获得总页数
        return $output;
    }
    //获取个人日记
    public function getDiary($id)
    {
        if($id!=1) $url="https://xiaoyou66.com/category/1000/1200/page/$id/";
        else $url="https://xiaoyou66.com/category/1000/1200/";
        $ch = curl_init(); //初始化curl模块
        curl_setopt($ch, CURLOPT_URL, $url); //登录提交的地址
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);//这个很关键就是把获取到的数据以文件流的方式返回，而不是直接输出
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //发送请求头
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36",
            "Referer: https://xiaoyou66.com/",
        ));
        $output=curl_exec($ch);
        curl_close($ch);//关闭连接
        //对获取到的内容进行解析
        phpQuery::newDocument($output);
        $page=pq(".pagination>li:last>a")->attr('href');//对获取到的内容进行处理
        $page=substr($page,0,strlen($page)-1);//截取字符然后获得总页数
        $pos=strripos($page,"/");
        $this->pages=substr($page,$pos+1);
        //获取日记内容
        foreach(pq(".panel-body-statue") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            array_push($this->title, trim($li->textContent));//移除两侧换行和空格
        }
        foreach(pq(".panel-heading>.text-muted") as $li)//这里是把我们获取到的内容遍历然后加到数组里面
        {
            array_push($this->create, trim($li->textContent));//移除两侧换行和空格
        }
        $arr=Array();
        $arr['title']=$this->title;
        $arr['create']=$this->create;
        return $arr;
    }


}