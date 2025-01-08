yo codedesignplus:microservice microservice <organization> <microservice> <description> <contactName> <contactEmail> <vault> <aggregate> --isCrud [--createController | --createProto | --createConsumer]

yo codedesignplus:microservice microservice codedesignplus organization "Custom_Item_Description" "Wilzon_Liscano" "wliscano93@gmail.com" "astro" "tower" usercreated user created userdcreatedd "myproto" --iscrud --createController --createProto --createConsumer


 <consumer.consumer> <consumer.aggregate> <consumer.action> <consumer.domainEvent>




 yo codedesignplus:microservice microservice \
    --organization codedesignplus \
    --microservice organization \
    --description "Custom Item Description" \
    --contact-name "Wilzon Liscano" \
    --contact-email "wliscano93@gmail.com" \
    --vault va-cdp \
    --is-crud \
    --aggregate tower \
    --enable-rest \
    --enable-grpc \
    --enable-async-worker \
    --consumer-consumer usercreated \
    --consumer-aggregate user \
    --consumer-action usercreatedd \
    --consumer-domainEvent created 


