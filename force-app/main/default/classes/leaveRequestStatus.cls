public class leaveRequestStatus {
    
    @AuraEnabled(cacheable=true)
        Public static list<Leave_Request__c> fetchPendingList(){

        List<Leave_Request__c> pendingList=[select Id,Employee__c,Name,Leave_status__c,Total_Days__c,Employee__r.Name,
        Employee__r.Total_leave_Balance__c,Employee__r.Name__c from Leave_Request__c WHERE Leave_status__c='Pending'];
        
        return pendingList;
    }
}