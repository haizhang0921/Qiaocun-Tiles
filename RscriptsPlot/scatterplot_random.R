setwd("projects/qiaocun")
library(ggplot2)
library(plyr)
library(ggpubr)
##plot cover tile size in sampling pool
cover<-read.table("coverinpool.csv",header=T,sep=",")
cover$cate<-cut(cover$time,breaks=c(-Inf,10,3000),labels=c(1,2))
ggscatterhist(cover,x="width_a",y="width_b",color="cate",size=0.5,alpha=0.6,palette=c("#00AFBB","#FC4E07"),margin.params=list(fill="cate",color="black",size=0.2))
##plot pan tile size in sampling pool
pan<-read.table("paninpool.csv",header=T,sep=",")
pan$cate<-cut(pan$time,breaks=c(-Inf,2,3000),labels=c(1,2))
ggscatterhist(pan,x="width_a",y="width_b",color="cate",size=0.5,alpha=0.6,palette=c("#00AFBB","#FC4E07"),margin.params=list(fill="cate",color="black",size=0.2))
