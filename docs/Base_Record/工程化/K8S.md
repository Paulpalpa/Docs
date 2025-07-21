---
sidebar_position: 4
---

# K8S学习

## 一、核心架构与组件
### 1.1 架构图解
- **控制平面**：
  - kube-apiserver：统一入口，支持nftables替代iptables（v1.29+）
  - etcd：分布式键值存储，推荐v3.5+
  - kube-scheduler：支持CEL表达式调度策略（v1.28+）
  - kube-controller-manager：集成ValidatingAdmissionPolicy（v1.27+）
- **数据平面**：
  - kubelet：支持节点级资源限制（v1.28+）
  - kube-proxy：默认使用nftables（v1.29+）
  - containerd：v1.7.13+，支持镜像加速

### 1.2 核心组件对比
| 组件        | 版本要求 | 关键特性                          |
|-------------|----------|-----------------------------------|
| Kubernetes  | ≥1.28    | Sidecar容器支持、CRD验证规则优化  |
| KubeSphere  | v4.1.2   | LuBan微内核架构、多云统一管理     |
| Rancher     | 2.7.5    | Longhorn存储集成、Fleet GitOps    |

## 二、资源对象详解
### 2.1 核心资源清单
```yaml
# Deployment示例（支持HPA/VPA）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
```

### 2.2 高级资源对象
- **CustomResourceDefinition (CRD)**：
  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: crontabs.stable.example.com
  spec:
    group: stable.example.com
    versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
  ```

## 三、网络与存储
### 3.1 网络模型
- **CNI插件对比**：
  | 插件       | 适用场景                  | 性能特点              |
  |------------|---------------------------|-----------------------|
  | Cilium     | 微服务、eBPF加速          | 10Gbps+吞吐量         |
  | Calico     | 跨云网络、网络策略        | 低延迟、高扩展性      |
- **Service Mesh**：
  - Istio 1.18+：支持nftables集成
  - Linkerd 2.14：零信任安全模型

### 3.2 存储方案
- **主流方案对比**：
  | 方案       | 适用场景              | 性能优势              |
  |------------|-----------------------|-----------------------|
  | OpenEBS   | 本地存储、开发测试    | 100k IOPS             |
  | Ceph       | 共享存储、生产环境    | 500k IOPS、三副本     |
  | Rook       | 云原生存储编排        | 自动化运维、跨云支持  |
- **PV配置示例**：
  ```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
    name: ceph-pv
  spec:
    capacity:
      storage: 100Gi
    accessModes:
    - ReadWriteOnce
    cephfs:
      monitors:
      - 10.0.0.1:6789
      - 10.0.0.2:6789
      user: admin
      secretRef:
        name: ceph-secret
  ```

## 四、高可用与安全
### 4.1 高可用部署
- **控制平面**：
  - 3节点etcd集群，使用RAFT协议
  - kube-apiserver负载均衡（HAProxy/Nginx）
- **计算平面**：
  ```yaml
  # PodDisruptionBudget示例
  apiVersion: policy/v1
  kind: PodDisruptionBudget
  metadata:
    name: web-pdb
  spec:
    minAvailable: 2
    selector:
      matchLabels:
        app: web
  ```

### 4.2 安全实践
- **Pod Security Admission**：
  ```yaml
  # 命名空间标签配置
  apiVersion: v1
  kind: Namespace
  metadata:
    name: restricted-ns
    labels:
      pod-security.kubernetes.io/enforce: restricted
      pod-security.kubernetes.io/enforce-version: v1.25
  ```
- **Secret管理**：
  - 使用Sealed Secrets加密
  - 集成Vault 1.12+

## 五、监控与日志
### 5.1 监控体系
- **Prometheus Stack**：
  ```yaml
  # ServiceMonitor示例
  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: web-monitor
  spec:
    selector:
      matchLabels:
        app: web
    endpoints:
    - port: web
      interval: 30s
  ```
- **Grafana仪表盘**：
  - 推荐使用KubeSphere内置模板

### 5.2 日志管理
- **Loki部署架构**：
  ![Loki Architecture](<FILE_START>file-imagination<FILE_END>)
  ```yaml
  # Loki配置示例（Simple Scalable）
  loki:
    enabled: true
    架构模式: SimpleScalable
    存储:
      type: s3
      s3:
        endpoint: minio.loki:9000
        access_key_id: admin
        secret_access_key: password
  ```

## 六、故障排查与优化
### 6.1 常用诊断命令
```bash
# 检查Pod状态
kubectl get pods -o wide --field-selector status.phase=Running

# 调试Pod
kubectl debug -it mypod --image=busybox

# 网络连通性测试
kubectl exec -it debug-pod -- curl -v http://service-name:80
```

### 6.2 自动扩缩容配置
- **HPA配置**：
  ```yaml
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: web-hpa
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: web
    minReplicas: 2
    maxReplicas: 10
    metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  ```

## 七、最佳实践
### 7.1 版本升级策略
1. 先升级控制平面（间隔≥1小时）
2. 再升级节点组件（每次≤1/3节点）
3. 验证关键组件（etcd、apiserver）

### 7.2 成本优化
- 使用Kubecost监控资源开销
- 配置Spot实例自动缩容策略
- 存储使用分级生命周期管理

## 八、2025年新特性
### 8.1 Kubernetes 1.29
- **核心更新**：
  - 弃用iptables，全面转向nftables
  - ValidatingAdmissionPolicy支持CRD验证
  - 混合版本代理支持滚动升级

### 8.2 生态工具
- **k0rdent**：AI驱动的预测性运维
- **Lens 5.0**：集成ChatGPT辅助诊断
- **Rook 2.0**：支持Ceph Quincy版本

---

**附录**：
1. [Kubernetes官方文档](https://kubernetes.io/docs/home/)
2. [KubeSphere最佳实践](https://kubesphere.io/docs/)
3. [Loki部署指南](https://grafana.com/docs/loki/latest/)