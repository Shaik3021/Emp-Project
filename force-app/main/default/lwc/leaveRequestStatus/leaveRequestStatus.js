import { LightningElement, wire,track } from 'lwc';
import fetchPendingList from '@salesforce/apex/leaveRequestStatus.fetchPendingList';
const actions = [
    { label: 'Edit', name: 'Edit' },
    { label: 'Delete', name: 'Delete' },
];


export default class LeaveRequestStatus extends LightningElement {
    @track data = [];
     error;
    search = '';
    @track Paginationdata = [];                
    @track currentPage = 1;
    @track Pagesize = 3;
    @track totalPage = 1;

    COLUMNS = [
        { label: 'Name', fieldName: 'employeeName' },
        { label: 'Leave Request Id', fieldName: 'leaveRequestId' },
        { label: 'Leave Status', fieldName: 'leaveStatus' },
        { label: 'Total Days', fieldName: 'totalDays' },
        { label: 'Leave Balance', fieldName: 'employeeLeaveBalance' },
        {
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    ];      

    @wire(fetchPendingList)
    wiredPendingList({ error, data }) {
        if (data) {
            this.data = data.map(leaveRequest => ({
                leaveRequestId: leaveRequest.Name,  
                leaveStatus: leaveRequest.Leave_status__c, 
                totalDays: leaveRequest.Total_Days__c, 
                employeeName: leaveRequest.Employee__r.Name__c, 
                employeeLeaveBalance: leaveRequest.Employee__r.Total_leave_Balance__c 
            }));
            this.error = undefined;
            //this.totalPage = Math.ceil(this.data.length/this.Pagesize);
            this.updatePageData();
            console.log("Data fetched successfully:", this.data ); 

        } else if (error) {
            this.error = error;
            this.data = [];
            console.error("Error fetching data:", error);
        }
    }
    handleSearchChange(event){
        this.search = event.target.value.toLowerCase();
        this.currentPage = 1;
        this.updatePageData();
    }
    get searchRecords(){
        return this.data.filter(item =>
            item.employeeName.toLowerCase().includes(this.search.toLowerCase()) ||
            item.leaveRequestId.toLowerCase().includes(this.search.toLowerCase()) ||
            item.leaveStatus.toLowerCase().includes(this.search.toLowerCase()) ||
            String(item.totalDays).includes(this.search.toLowerCase()) ||  // Ensure number fields are compared as strings
            String(item.employeeLeaveBalance).includes(this.search.toLowerCase())
  );
    }
    updatePageData(){
        this.totalPage = Math.ceil(this.searchRecords.length / this.Pagesize);
        const start = (this.currentPage - 1)* this.Pagesize;
        const end = start + this.Pagesize;
        this.Paginationdata = this.searchRecords.slice(start,end);
    }

    handleNextPage() {
        if (this.currentPage < this.totalPage) {
            this.currentPage += 1;
            this.updatePageData();
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.updatePageData();
        }
    }

    get isNextDisabled() {
        return this.currentPage >= this.totalPage;
    }

    get isPreviousDisabled() {
        return this.currentPage <= 1;
    }

}