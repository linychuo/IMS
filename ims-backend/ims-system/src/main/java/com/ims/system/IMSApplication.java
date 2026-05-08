package com.ims.system;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.ims")
@MapperScan(basePackages = {"com.ims.*.mapper"})
public class IMSApplication {

    public static void main(String[] args) {
        SpringApplication.run(IMSApplication.class, args);
    }
}
