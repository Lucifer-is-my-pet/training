use strict;
use warnings;
use File::Find;

my $compressor = 'c:\Downloads\yuicompressor-2.4.8\yuicompressor-2.4.8.jar';

sub subst {
    $_ = shift;
    $_ =~ s#'#\\'#g;
    $_ =~ s#([\t\s]{2,}|\n)##g;
    return "'" . $_ . "';";
}

sub concatAndCompress {
    my $extension = shift;
    my $bundledFile = 'bundle.' . $extension;
    my @fileList = ();
    find (sub {
            if ($_ =~ /(.+\.$extension)/) {
            push @fileList, $File::Find::name;
        }
        }, $extension);

    my $out = '';

    for my $file(@fileList) {
        open my $text, "<", $file or die "Could not open file $file : $!";
        if ($file =~ m/main\.js/i) {
            $out .= "start();
            function start () {
                if (!document.body) {
                    setTimeout(start, 100);
                    return;
                }
                main();
            }";
        }

        while (my $line = <$text>) {
          $out .= $line;
        }
        $out .= "\n";
    }
    if ($extension eq 'js') {
        $out =~ s#<<([A-Z]+);\n(.+)\n\1#subst($2)#es; # многострочные комментарии перловые превращаются в
#        джаваскриптовые
        $out =~ s%\$([a-z_]+)%\'\+$1\+\'%ig; # замена переменных с $
    }

    open my $output, '>', $bundledFile;
    print {$output} $out;

    my $compressed = `java -jar $compressor $bundledFile`;
    return $compressed;
}

my $compressedJS = concatAndCompress('js');
my $compressedCSS = concatAndCompress('css');

local $/ = undef;

open my $input, '<', 'Click-click.html' or die "Could not open file 'Click-click.html' : $!";
open my $output, '>', 'bundle.html';

my $html = <$input>;
$html =~ s%(.*<script.+/script>\n|.*<link.+>\n)%%mg;
my $style = "<style>" . $compressedCSS . "</style>\n";
my $script = "<script>" . $compressedJS . "</script>\n";
$html =~s%</head>%$style$script</head>%;
print {$output} $html;

# TODO чтоб можно было написать ${выражение для подстановки, возможно, тоже с фигурными скобками единожды} и
#подставлялось также, как с долларом