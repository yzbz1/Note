public class ClassMethodTest {
    public static void main(String[] args) {
        System.out.println("项目运行测试");

        //1。parseInt();方法
        System.out.println("------------------------Demo1------------------------");
        String s = "8";
        int sInt = Integer.parseInt(s);
        int i1 = 10 + sInt;
        System.out.println(i1);

        //2。循环范例
        System.out.println("------------------------Demo2------------------------");
        int x1 = 1;
        System.out.println("循环前");
        while(x1 < 4){
            System.out.println("循环中");
            System.out.println("x1的值是"+ x1);
            x1++;
        }
        System.out.println("循环后");



        //idea git提交测试

    }
}
