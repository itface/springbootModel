package net.itface.springboot.system;

import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Objects;

/**
 * Created by wangrongtao on 2016/11/11.
 */
public class LoginInterceptor extends HandlerInterceptorAdapter {

    private final String LOGIN_COOKIE_NAME = "ssologin";
    public void addCookie(HttpServletResponse response,String name,String value,int maxAge){
        Cookie cookie = new Cookie(name,value);
        cookie.setPath("/");////设置路径，这个路径即该工程下都可以访问该cookie 如果不设置路径，那么只有设置该cookie路径及其子路径可以访问
        if(maxAge>0)  cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }
    public void deleteCookie(HttpServletResponse response,String name){
        addCookie(response,name,null,0);
    }
    /**
     * 根据名字获取cookie
     * @param request
     * @param name cookie名字
     * @return
     */
    public Cookie getCookieByName(HttpServletRequest request,String name){
        Cookie[] cookies = request.getCookies();
        if(null!=cookies){
            for(Cookie cookie : cookies){
                if (Objects.equals(name, cookie.getName())) {
                    return cookie;
                }
            }
        }
        return null;
    }

    public void addLoginCookie( HttpServletResponse response){
        long expiretime = new Date().getTime() + 10;
        String realstr = stringMD5("itface"+expiretime+"abc"+"secret");
        String targetvalue = "itface"+":"+expiretime+":"+realstr;
        addCookie(response,LOGIN_COOKIE_NAME,targetvalue,10);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        /*addLoginCookie(response);
        return true;*/
        Cookie cookie = getCookieByName(request,LOGIN_COOKIE_NAME);
        if (cookie == null) {
            response.setStatus(HttpStatus.OK.value());
            return false;
        }
        String cookievalue = cookie.getValue();
        String[] arr = cookievalue.split(":");
        String uid = arr[0];
        String expiretime = arr[1];
        String md5Str = arr[2];
        String realstr = stringMD5("itface"+expiretime+"abc"+"secret");
        if (Objects.equals(realstr, md5Str)) {
            return true;
        }else {
            response.getOutputStream().write("error！".getBytes());
            response.setStatus(HttpStatus.OK.value());
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
            throws Exception {
        // TODO Auto-generated method stub
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // TODO Auto-generated method stub
    }

    public static void main(String[] args) {
    }
    public  String stringMD5(String input) {

        try {

            // 拿到一个MD5转换器（如果想要SHA1参数换成”SHA1”）

            MessageDigest messageDigest = MessageDigest.getInstance("MD5");


            // 输入的字符串转换成字节数组

            byte[] inputByteArray = input.getBytes();



            // inputByteArray是输入字符串转换得到的字节数组

            messageDigest.update(inputByteArray);



            // 转换并返回结果，也是字节数组，包含16个元素

            byte[] resultByteArray = messageDigest.digest();



            // 字符数组转换成字符串返回

            return byteArrayToHex(resultByteArray);



        } catch (NoSuchAlgorithmException e) {

            return null;

        }

    }
    public  String byteArrayToHex(byte[] byteArray) {
        // 首先初始化一个字符数组，用来存放每个16进制字符
        char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9', 'A','B','C','D','E','F' };
        // new一个字符数组，这个就是用来组成结果字符串的（解释一下：一个byte是八位二进制，也就是2位十六进制字符（2的8次方等于16的2次方））
        char[] resultCharArray =new char[byteArray.length * 2];
        // 遍历字节数组，通过位运算（位运算效率高），转换成字符放到字符数组中去
        int index = 0;
        for (byte b : byteArray) {
            resultCharArray[index++] = hexDigits[b>>> 4 & 0xf];
            resultCharArray[index++] = hexDigits[b& 0xf];
        }
        // 字符数组组合成字符串返回
        return new String(resultCharArray);

    }
}
