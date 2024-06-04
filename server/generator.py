import secrets
import string
import random
with open('gen.txt', 'w', encoding="utf-8") as f:
    alphabet = string.ascii_letters + string.digits
    f.writelines([(''.join(secrets.choice(alphabet) for i in range(20)) + "_" + str(random.randint(0,3)) + "-" + str(x) + "///") for x in range(300)])