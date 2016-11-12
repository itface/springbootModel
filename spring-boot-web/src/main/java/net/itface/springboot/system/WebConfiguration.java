package net.itface.springboot.system;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by wangrongtao on 2016/11/11.
 */
//@Configuration
public class WebConfiguration extends WebMvcConfigurerAdapter {
    /**
     * 添加拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                //添加需要验证登录用户操作权限的请求
                .addPathPatterns("/**", "/testContrl/update*", "/testContrl/delete*")
                //排除不需要验证登录用户操作权限的请求
                .excludePathPatterns("/userCtrl/*");
    }
}
