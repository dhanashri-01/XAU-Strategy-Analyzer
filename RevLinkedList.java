class Node{
    int data;
    Node next;
    Node (int data){
        this.data=data;
    }
    
}

public class RevLinkedList{
    static Node reverse(Node head){
        Node prev=null;
        Node curr=head;
        Node next=null;
        
        while(curr!=null){
            next=curr.next;
            curr.next=prev;
            prev=curr;
            curr=next;
        }
        return prev;
    }
    
    static void print(Node head){
        while(head!=null){
            System.out.println(head.data +"");
        }
    }
    
    public static void main(String[] args){
        Node head=new Node(1);
        head.next=new Node(2);
        head.next.next=new Node(3);
        head.next.next.next=new Node(4);
        
        
        System.out.println("Orginal List");
        print(head);
        
        head=reverse(head);
        System.out.println("\n Reversed List");
        print(head);

        
    }
}