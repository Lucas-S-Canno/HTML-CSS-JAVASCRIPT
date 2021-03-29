def prime(n):
    if (n<3): return 1
    for i in range(2,n):
        if (n%i==0): return i
    return 1

print(prime(7))