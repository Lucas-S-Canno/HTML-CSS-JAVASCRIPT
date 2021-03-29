def rem_vowel(string): 
    vowels = ('a', 'e', 'i', 'o', 'u')  
    for x in string.lower(): 
        if x in vowels: 
            string = string.replace(x, "") 
              
    # Print string without vowels 
    print(string) 
def rem_cons(string): 
    vowels = ('a', 'e', 'i', 'o', 'u')  
    for x in string.lower(): 
        if x not in vowels: 
            string = string.replace(x, "") 
              
    # Print string without vowels 
    print(string) 
  
# Driver program 
string = "geeksforgeeks - a computer science portal for geeks"
rem_vowel(string)
rem_cons(string)