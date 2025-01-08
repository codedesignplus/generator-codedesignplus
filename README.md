yo codedesignplus:microservice microservice <organization> <microservice> <description> <contactName> <contactEmail> <vault> <aggregate> --isCrud [--createController | --createProto | --createConsumer]

yo codedesignplus:microservice microservice codedesignplus organization "Custom_Item_Description" "Wilzon_Liscano" "wliscano93@gmail.com" "astro" "tower" usercreated user created userdcreatedd "myproto" --iscrud --createController --createProto --createConsumer


 <consumer.consumer> <consumer.aggregate> <consumer.action> <consumer.domainEvent>




 yo codedesignplus:microservice microservice 
    --organization codedesignplus
    --microservice organization
    --description "Custom_Item_Description"
    --contactName "Wilzon Liscano"
    --contactEmail "wliscano93@gmail.com"
    --isCrud
    --createController
    --createProto
    --proto myproto
    --createConsumer
    --consumerConsumer usercreated
    --consumerAggregate user
    --consumerAction usercreatedd
    --consumerDomainEvent created