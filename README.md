
1. Microservice Is Crud
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
    --consumer-name userCreated \
    --consumer-aggregate user \
    --consumer-action send-email 

2. Microservice Is Not Crud

yo codedesignplus:microservice microservice \
    --organization codedesignplus \
    --microservice organization \
    --description "Custom Item Description" \
    --contact-name "Wilzon Liscano" \
    --contact-email "wliscano93@gmail.com" \
    --vault va-cdp \
    --aggregate tower \
    --enable-rest \
    --enable-grpc \
    --enable-async-worker \
    --consumer-name userCreated \
    --consumer-aggregate user \
    --consumer-action send-email \
    --domain-events "TowerCreated, TowerUpdated, TokerDeleted" \
    --entities MyEntity \
    --commands CreateTower,UpdateTower,DeleteTower \
    --queries FindByIdTower 

3. 
yo codedesignplus:microservice aggregate \
    --organization codedesignplus \
    --microservice organization \
    --aggregate Role

4. 
yo codedesignplus:microservice entity \
    --organization codedesignplus \
    --microservice organization \
    --entities TV,mobile

5. 
yo codedesignplus:microservice valueObject \
    --organization codedesignplus \
    --microservice organization \
    --valueObjects UserName,Tenant

6. 
yo codedesignplus:microservice domainEvent \
    --organization codedesignplus \
    --microservice organization \
    --aggregate Role \
    --domainEvents RoleCreated,RoledDeleted


7.
yo codedesignplus:microservice repository \
    --organization codedesignplus \
    --microservice organization \
    --repository Role

8.
yo codedesignplus:microservice controller \
    --organization codedesignplus \
    --microservice organization \
    --controller OtherRole

9.
yo codedesignplus:microservice proto \
    --organization codedesignplus \
    --microservice organization \
    --proto-name Role

10. 
yo codedesignplus:microservice consumer \
    --organization codedesignplus \
    --microservice organization \
    --consumer-name InvoiceCreated \
    --consumer-aggregate Invoice \
    --consumer-action send-email

11.
yo codedesignplus:microservice query \
    --organization codedesignplus \
    --microservice organization \
    --aggregate Role \
    --repository Role \
    --queries FindRoleById,GetAllRoles


12. 
yo codedesignplus:microservice command \
    --organization codedesignplus \
    --microservice organization \
    --aggregate Role \
    --repository Role \
    --commands CreateRole,UpdateRole
    