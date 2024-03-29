import java.util.Random;

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

        System.out.println("------------------------Demo2------------------------");
        int x2 = 3;
        if (x2 == 3){
            System.out.println("x must be 3");
        }else {
            System.out.println("x is not 3");
        }
        System.out.println("this runs no matter what");

        System.out.println("------------------------Demo2------------------------");

        int beerNum = 99;
        String word = "bottles";
        while (beerNum > 0) {
            if (beerNum == 1) {
                word = "bottles"; //      
            }
            System.out.print(beerNum + " " + word + "  of beer on the wall");
            System.out.print(beerNum + " " + word + " of beer.");
            System.out.print("Take one down.");
            System.out.print("Pass it around.");
            beerNum = beerNum - 1;
            if (beerNum > 0) {
                System.out.println(beerNum + " " + word +  "of beer on the wall");
            } else {
                System.out.println("No more bottles of beer on the wall");
            }//else  
        } //while    

        System.out.println("------------------------Demo2------------------------");
        String[] wordlistone = {
                "废话1","废话2","废话3"
        };
        //计算每一组单词数目
        int onelength = wordlistone.length;

        //产生随机数字
        int rand1 = (int) (Math.random() * onelength);
        int rand2 = (int) (Math.random() * onelength);

        //输出组合单词
        System.out.println(wordlistone[rand1] + "" + wordlistone[rand2]);
        System.out.println("------------------------Demo2------------------------");
        //小测试哈哈        输出 a-b c-d
        int x = 3;
        while(x>0) {
            if (x > 2) {
                System.out.print("a");
            }

            if (x == 2) {
                System.out.print("b c");
            }
            System.out.print("-");
            x = x-1;
            if (x == 1) {
              System.out.print("d");
                x = x-1;
            }




        }



    }

/*
  @Title generateRandomPasswordAndNotContainsAccount
* @return String
* @param len
* @param account
* @return
* @date 2017年5月26日 下午3:06:07
* @author fush
* @Description
* 生成验证过的指定长度随机密码
* 且这个字符串必须包含大小写字母、数字和特殊字符，四种的任意两种，密码中不包含指定字符串
*/


    public static String makeRandomPassword(){
        char charr[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*.?".toCharArray();
        //System.out.println("字符数组长度:" + charr.length); //可以看到调用此方法多少次
        StringBuilder sb = new StringBuilder();
        Random r = new Random();
        for (int x = 0; x < 10; ++x) {
            sb.append(charr[r.nextInt(charr.length)]);
        }
        return sb.toString();
    }


    public static String generateRandomPassword() {
        while(true){
            String result = makeRandomPassword();
            int charTypeCount = 0;
            if (result.matches(".*[a-z]{1,}.*")) {
                charTypeCount ++;
            }
            if (result.matches(".*[A-Z]{1,}.*")) {
                charTypeCount ++;
            }
            if (result.matches(".*\\d{1,}.*")) {
                charTypeCount ++;
            }
            if (result.matches(".*[~!@#$%^&*\\.?]{1,}.*")) {
                charTypeCount ++;
            }
            if (charTypeCount >= 2) {
                return result;
            }
        }
    }
}
