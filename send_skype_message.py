import sys

from skpy import Skype

sk = Skype("8660558126", "Motli@321", "./.tokens-app")

ch = sk.contacts['live:.cid.7c28c93f39dd4afd'].chat
print('Sending message ' + sys.argv[1] + ' to horizontechnologisulutions')
ch.sendMsg(sys.argv[1]);

ch = sk.contacts['live:.cid.a3205fabc37a796c'].chat
print('Sending message ' + sys.argv[1] + ' to globalautocomponents')
ch.sendMsg(sys.argv[1]);
