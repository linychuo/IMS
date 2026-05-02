package com.ims.common.entity;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 基础实体类
 * 使用 Java 21 Record 风格的不可变数据，但为了 JPA/Hibernate 兼容性，使用 @Entity + Lombok
 */
@MappedSuperclass
@DynamicInsert
@DynamicUpdate
@Data
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID - 使用 UUID
     */
    @Id
    @Column(name = "id", length = 36)
    @NotNull
    protected String id;

    /**
     * 创建时间
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    protected LocalDateTime updatedAt;

    /**
     * 创建人ID
     */
    @Column(name = "created_by", length = 36, updatable = false)
    protected String createdBy;

    /**
     * 更新人ID
     */
    @Column(name = "updated_by", length = 36)
    protected String updatedBy;

    /**
     * 删除标志 (0-未删除, 1-已删除)
     */
    @Column(name = "deleted", length = 1)
    protected Integer deleted = 0;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (deleted == null) {
            deleted = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * 检查是否已删除
     */
    public boolean isDeleted() {
        return deleted != null && deleted == 1;
    }

    /**
     * 标记为已删除
     */
    public void markDeleted() {
        deleted = 1;
    }

    /**
     * 恢复删除
     */
    public void unmarkDeleted() {
        deleted = 0;
    }
}