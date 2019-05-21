
This is my hosts file on the mac.

To open:
$ sudo nano /etc/hosts 

To save:
control + o (charter o, not zero)

To exit: 
control + x


To flush the cache:

$ sudo dscacheutil -flushcache


##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

## the address below is my PC's IP address while on the Rosnet network
## 192.168.1.78 dashboard.dywaynes-pc.com
## 192.168.1.78 aag.dywaynes-pc.com

## the address below is my PC's IP address while on the Rosnet VPN
192.168.1.15 dashboard.dywaynes-pc.com
192.168.1.15 aag.dywaynes-pc.com
192.168.1.15 srr.dywaynes-pc.com

## 2aa17895.ngrok.io dashboard.dywaynes-pc.com
## 2aa17895.ngrok.io aag.dywaynes-pc.com

