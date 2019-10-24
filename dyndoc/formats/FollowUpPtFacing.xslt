<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:dd="DynamicDocumentation"
    xmlns:java-string="java:java.lang.String"
    exclude-result-prefixes="xsl xs n cdocfx doc">

    <!-- Comment out this line to debug--> <xsl:import href="/cernerbasiccontent/formats/addressfxn.xslt"/>
    <!-- Uncomment this line to debug> <xsl:include href="AddressFxn.xslt"> -->
    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!-- Uncomment this line to debug> <xsl:include href="commonfxn.xslt"> -->
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
    
    
    
    <!-- Default string constants -->
    <xsl:variable name="Why" as="xs:string">
        <xsl:value-of select="'Why:'"/>
    </xsl:variable>

    <xsl:variable name="With" as="xs:string">
        <xsl:value-of select="'With:'"/>
    </xsl:variable>

    <xsl:variable name="Where" as="xs:string">
        <xsl:value-of select="'Where:'"/>
    </xsl:variable>

    <xsl:variable name="When" as="xs:string">
        <xsl:value-of select="'When:'"/>
    </xsl:variable>
    
    <xsl:variable name="Day" as="xs:string">
        <xsl:value-of select="'day'"/>
    </xsl:variable>
    
    <xsl:variable name="Days" as="xs:string">
        <xsl:value-of select="'days'"/>
    </xsl:variable>
    
    <xsl:variable name="Week" as="xs:string">
        <xsl:value-of select="'week'"/>
    </xsl:variable>
    
    <xsl:variable name="Weeks" as="xs:string">
        <xsl:value-of select="'weeks'"/>
    </xsl:variable>
    
    <xsl:variable name="Month" as="xs:string">
        <xsl:value-of select="'month'"/>
    </xsl:variable>
    
    <xsl:variable name="Months" as="xs:string">
        <xsl:value-of select="'months'"/>
    </xsl:variable>
    
    <xsl:variable name="Year" as="xs:string">
        <xsl:value-of select="'year'"/>
    </xsl:variable>
    
    <xsl:variable name="Years" as="xs:string">
        <xsl:value-of select="'years'"/>
    </xsl:variable>
    
    <xsl:variable name="Within" as="xs:string">
        <xsl:value-of select="'Within'"/>
    </xsl:variable>
    
    <xsl:variable name="WithinSomeTimeFormatter" as="xs:string">
        <xsl:value-of select="'%1$s %2$s'"/>
    </xsl:variable>
    
    <xsl:variable name="In" as="xs:string">
        <xsl:value-of select="'In'"/>
    </xsl:variable>
    
    <xsl:variable name="InSomeTimeFormatter" as="xs:string">
        <xsl:value-of select="'%1$s %2$s %3$s '"/>
    </xsl:variable>
    
    <xsl:variable name="OnlyIfNeededBeginning" as="xs:string">
        <xsl:value-of select="'Only if needed'"/>
        <!-- Used in the beginning of a sentence or phrase -->
    </xsl:variable>
    
    <xsl:variable name="OnlyIfNeededNotBeginning" as="xs:string">
        <xsl:value-of select="', only if needed'"/>
        <!-- Used in the middle of a sentence or phrase -->
    </xsl:variable>
    
    <xsl:variable name="Contact" as="xs:string">
        <xsl:value-of select="'Contact Information'"/>
    </xsl:variable>
    
    <xsl:variable name="Comments" as="xs:string">
        <xsl:value-of select="'Additional Instructions'"/>
    </xsl:variable>
    
    <xsl:variable name="NoFollowup" as="xs:string">
        <xsl:value-of select="''"/>
    </xsl:variable>

    <xsl:variable name="FollowupWith" as="xs:string">
        <xsl:value-of select="'Follow Up with'"/>
    </xsl:variable>

    <xsl:variable name="DATE_SEQUENCE_UTC_ON_WITH_TIME" as="xs:string" select="'MM/dd/yyyy hh:mm a zzz'"/>
    
    <xsl:variable name="DATE_SEQUENCE_UTC_ON_WITHOUT_TIME" as="xs:string" select="'MM/dd/yyyy zzz'"/>
    
    <xsl:variable name="DATE_SEQUENCE_UTC_OFF_WITH_TIME" as="xs:string" select="'MM/dd/yyyy hh:mm a'"/>
    
    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
    
    <!-- This will be over-written during Run-Time -->
    <xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
    
    <xsl:template match="/">
        
        <xsl:choose>
            <xsl:when test="n:report/n:clinical-data/n:follow-up-data/n:follow-up">
                <table style="border-collapse: collapse; table-layout: fixed;" dd:btnfloatingstyle="top-right" dd:whitespacecolseparator="true">
                    <!-- Separate columns by a space in plain text conversion -->
                    <colgroup>
                        <col style="width:30%;" />
                        <col style="width:70%;" />
                    </colgroup>
                    <tbody>
                        <xsl:for-each select="n:report/n:clinical-data/n:follow-up-data/n:follow-up">
                            <!-- sort by date time of followup -->
                            <xsl:sort select="n:follow-up-dt-tm" order="descending"/>
                            <tr class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
                                <xsl:attribute name="dd:entityid">
                                    <xsl:value-of select="@patient-education-follow-up-id"/>
                                </xsl:attribute>
                                <xsl:attribute name="dd:contenttype">
                                    <xsl:text>FOLLOW_UP</xsl:text>
                                </xsl:attribute>
								
                                <td style="vertical-align: top; padding-left: 6px;padding-bottom:15px; word-wrap: break-word;">
                                    <span style="font-weight: bold;">
                                        <xsl:value-of select="$FollowupWith"/>
                                    </span>
                                    <xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
                                    <xsl:value-of select="@provider-name"/>
                                    <br/>
                                    <xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string">
                                        <xsl:choose>
                                            <xsl:when test="@follow-up-unit != '' and @follow-up-unit != 'IGNORE'">
                                                <!-- A unit (such as day) is selected for this followup, so we don't want to output midnight -->
                                                <xsl:value-of select="$DATE_SEQUENCE_UTC_ON_WITHOUT_TIME"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="$DATE_SEQUENCE_UTC_ON_WITH_TIME"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:variable>
                                    <xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string">
                                        <xsl:choose>
                                            <xsl:when test="@follow-up-unit != '' and @follow-up-unit != 'IGNORE'">
                                                <!-- A unit (such as day) is selected for this followup, so we don't want to output midnight -->
                                                <xsl:value-of select="$DATE_ONLY_SEQUENCE"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="$DATE_SEQUENCE_UTC_OFF_WITH_TIME"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:variable>
                                    <!-- This is a derived variable and doesn't need to go in the i18n string tables -->
                                    <xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
                                    <span style="font-weight: bold;">
                                        <xsl:value-of select="$When"/>
                                    </span>
                                    <xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
                                    <xsl:call-template name="DisplayWhen">
                                        <xsl:with-param name="FollowupWhen" select="."/>
                                        <xsl:with-param name="DateSequence" select="$DATE_SEQUENCE"/>
                                    </xsl:call-template>
                                </td>
                                <td style="vertical-align: top; padding-left: 6px;padding-bottom: 15px; word-wrap: break-word;">
                                    <table>
                                        <tr>
                                            <td style="text-align:right;vertical-align: top;white-space:nowrap;font-weight: bold;">
                                                <xsl:if test="n:comment">
                                                    <xsl:value-of select="$Why"/>
                                                </xsl:if>
                                            </td>
                                            <td>
                                                <xsl:if test="n:comment">
                                                    <xsl:for-each select="n:comment">
                                                        <xsl:variable name="Comment" as="xs:string">
                                                            <xsl:value-of select="."/>
                                                        </xsl:variable>
                                                        <xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml($Comment)"/>
                                                        <br/>
                                                    </xsl:for-each>
                                                </xsl:if>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:right; vertical-align: top; white-space: nowrap; font-weight: bold;">
                                                <xsl:if test="n:follow-up-location">
                                                    <xsl:value-of select="$Where"/>
                                                </xsl:if>
                                            </td>
                                            <td>
                                                <xsl:if test="n:follow-up-location">
                                                    <xsl:for-each select="n:follow-up-location">
                                                        <xsl:call-template name="DisplayLocation">
                                                            <xsl:with-param name="Location" select="."/>
                                                        </xsl:call-template>
                                                        <xsl:if test="@follow-up-phone-freetext and @follow-up-phone-freetext!=''">
                                                            <br />
                                                            <xsl:value-of select="@follow-up-phone-freetext"/>
                                                        </xsl:if>
                                                        <xsl:if test="position()!=last()">
                                                            <br /><br />
                                                        </xsl:if>
                                                    </xsl:for-each>
                                                </xsl:if>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$NoFollowup"/>
            </xsl:otherwise>
        </xsl:choose>

    </xsl:template>
    
    <xsl:template name="DisplayWhen">
        <xsl:param name = "FollowupWhen"/>
        <xsl:param name = "DateSequence"/>
        <xsl:if test="$FollowupWhen/@follow-up-unit != '' and $FollowupWhen/@follow-up-unit != 'IGNORE'">
            <xsl:variable name="TimeValue" as="xs:string">
                <xsl:value-of select="$FollowupWhen/@follow-up-value"/>
            </xsl:variable>
            <xsl:variable name="TimeUnit" as="xs:string">
                <xsl:call-template name="DisplayTimeUnit">
                    <xsl:with-param name="TimeValue" select="$FollowupWhen/@follow-up-value"/>
                    <xsl:with-param name="TimeUnit" select="$FollowupWhen/@follow-up-unit"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:value-of select="java-string:format($InSomeTimeFormatter, ($In, $TimeValue, $TimeUnit))"/>
        </xsl:if>
        
        <xsl:choose>
            <xsl:when test="$FollowupWhen/n:follow-up-dt-tm">
                <xsl:variable name="FollowupDtTm" as="xs:dateTime" select="$FollowupWhen/n:follow-up-dt-tm"/>
                <xsl:variable name="FollowupTimeZone" as="xs:string" select="$FollowupWhen/n:follow-up-dt-tm/@time-zone"/>
                <xsl:value-of select="xr-date-formatter:formatDate($FollowupDtTm, $DateSequence, $FollowupTimeZone, $current-locale)"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="$FollowupWhen/@follow-up-within-range and $FollowupWhen/@follow-up-within-range!=''">
                    <xsl:variable name="TimeRange" as="xs:string">  
                        <xsl:value-of select="$FollowupWhen/@follow-up-within-range"/>
                    </xsl:variable>
                    <xsl:value-of select="java-string:format($WithinSomeTimeFormatter, ($Within, $TimeRange))"/>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:if test="$FollowupWhen/@if-needed = 'true'">
            <xsl:choose>
                <xsl:when test="($FollowupWhen/@follow-up-unit != '' and $FollowupWhen/@follow-up-unit != 'IGNORE')
                or ($FollowupWhen/n:follow-up-dt-tm)
                or ($FollowupWhen/@follow-up-within-range and $FollowupWhen/@follow-up-within-range!='')">
                    <xsl:value-of select="$OnlyIfNeededNotBeginning"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$OnlyIfNeededBeginning"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="DisplayTimeUnit">
        <xsl:param name="TimeValue"/>
        <xsl:param name="TimeUnit"/>
        <xsl:choose>
            <xsl:when test="$TimeValue='1'">
                <xsl:choose>
                    <xsl:when test="$TimeUnit='DAYS'">
                        <xsl:value-of select="$Day"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='WEEKS'">
                        <xsl:value-of select="$Week"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='MONTHS'">
                        <xsl:value-of select="$Month"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='YEARS'">
                        <xsl:value-of select="$Year"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="''"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:choose>
                    <xsl:when test="$TimeUnit='DAYS'">
                        <xsl:value-of select="$Days"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='WEEKS'">
                        <xsl:value-of select="$Weeks"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='MONTHS'">
                        <xsl:value-of select="$Months"/>
                    </xsl:when>
                    <xsl:when test="$TimeUnit='YEARS'">
                        <xsl:value-of select="$Years"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="''"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="DisplayLocation">
        <xsl:param name = "Location"/>
        <xsl:if test="$Location/n:follow-up-address">
            <xsl:for-each select="$Location/n:follow-up-address">
                <xsl:call-template name="DisplayAddress">
                    <xsl:with-param name="address" select="."/>
                </xsl:call-template>
            </xsl:for-each>
        </xsl:if>   
    </xsl:template>
    
</xsl:stylesheet>
