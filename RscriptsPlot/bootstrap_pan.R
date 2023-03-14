setwd("projects/qiaocun")
##data import
pan<-read.table("pan.csv",header=F,sep=",")
pan<-pan$V1
##define the larger and smaller ends
longend<-rep(NULL,1000)
shortend<-rep(NULL,1000)
##select two value randomly and compare to assign to larger or smaller end
for (i in 1:1000){
a<-sample(pan,2,replace=T)
if(a[1]!=a[2]){
longend[i]<-max(a)
shortend[i]<-min(a)
}
else{
return(a)}
}
##normal distribution test
shapiro.test(longend)
mean(longend)
sd(longend)
mean(longend)
shapiro.test(shortend)
mean(shortend)
sd(shortend)