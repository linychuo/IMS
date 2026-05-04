package com.ims.common.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * MyBatis 配置
 * 注意：DataSource 和 TransactionManager 由 Spring Boot 自动配置
 */
@Configuration
@MapperScan(basePackages = {"com.ims.**.mapper"})
public class MyBatisConfig {

    /**
     * 配置 SqlSessionFactory
     * 使用 Spring Boot 自动配置的 DataSource
     */
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver()
                        .getResources("classpath*:mapper/**/*.xml")
        );
        factoryBean.setTypeAliasesPackage("com.ims.common.entity");
        
        // 配置 MyBatis 配置
        var config = new org.apache.ibatis.session.Configuration();
        config.setMapUnderscoreToCamelCase(true);
        config.setUseGeneratedKeys(true);
        config.setUseColumnLabel(true);
        factoryBean.setConfiguration(config);
        
        return factoryBean.getObject();
    }
}