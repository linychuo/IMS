package com.ims;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableAsync
@EnableScheduling
@ComponentScan(basePackages = "com.ims")
@MapperScan(basePackages = "com.ims.**.mapper")
public class ImsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ImsApplication.class, args);
    }
}