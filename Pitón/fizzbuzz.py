def fizzbuzz(n):
    for i in range(1,n+1):
        fb = ""
        if(i%3==0): fb = fb + "Fizz"
        if(i%5==0): fb = fb + "Buzz"
        if (fb==""): print(i)
        else: print(fb)

fizzbuzz(15)