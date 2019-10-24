<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" 
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities" 
    xmlns:n="urn:com-cerner-patient-ehr:v3" 
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
    xmlns:dd="DynamicDocumentation" 
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    exclude-result-prefixes="xsl xs fn n doc cdocfx xr-date-formatter">
    
    <!-- Comment out this line to debug --> <xsl:include href="/cernerbasiccontent/formats/addressfxn.xslt"/>
    <!-- Uncomment this line to debug> <xsl:include href="AddressFxn.xslt"/> -->
    <!-- Required to include CommonFxn.xslt -->
    <!-- Comment out this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!-- Uncomment this line to debug> <xsl:include href="CommonFxn.xslt"/> -->
    
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- This will be over-written during Run-Time -->
    <xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

    <xsl:variable name="DATE_SEQUENCE_UTC_ON_DAY" as="xs:string" select="'ddd hh:mm a zzz'"/>

    <xsl:variable name="DATE_SEQUENCE_UTC_OFF_DAY" as="xs:string" select="'ddd hh:mm a'"/>

    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

    <xsl:variable name="DATE_SEQUENCE_DAY" as="xs:string" select="'EEEE'"/>

    <xsl:variable name="DATE_SEQUENCE_DATE" as="xs:string" select="'MMM. d, yyyy'"/>

    <xsl:variable name="DATE_SEQUENCE_TIME" as="xs:string" select="'h:mm a zzz'"/>



    <!-- Default string constants -->
    <xsl:variable name="Type">
        <xsl:value-of select="'Appointment Type'"/>
    </xsl:variable>

    <xsl:variable name="When" as="xs:string">
        <xsl:value-of select="'When:'"/>
    </xsl:variable>

    <xsl:variable name="With" as="xs:string">
        <xsl:value-of select="'With:'"/>
    </xsl:variable>
    
    <xsl:variable name="Where" as="xs:string">
        <xsl:value-of select="'Where:'"/>
    </xsl:variable>

    <xsl:variable name="Contact" as="xs:string">
        <xsl:value-of select="'Contact Information'"/>
    </xsl:variable>


    <xsl:template match="/">
        <xsl:choose>
            <!-- When there is a scheduled appointment documented.  -->
            <xsl:when test="count(n:report/n:clinical-data/n:future-appointment-data/n:appointment) &gt; 0">

                <table dd:btnfloatingstyle="top-right" dd:whitespacecolseparator="true" style="border-collapse: collapse; table-layout: fixed;"> 
				<!-- Separate columns by a space in plain text conversion -->
                    <tbody>
                        <xsl:for-each select="n:report/n:clinical-data/n:future-appointment-data/n:appointment">
                            <!-- sort by date time of appointment -->
                            <xsl:sort select="n:appointment-begin-dt-tm" order="ascending"/>
      
                            <xsl:variable name="ApptDtTm" as="xs:dateTime" select="n:appointment-begin-dt-tm"/>
                            <!--This check is made to display only future appointment i.e., appointment date time should be greater than current date time -->
	                        <xsl:if test="doc:getTimeInMillisecs(xs:string($ApptDtTm)) &gt; doc:getTimeInMillisecs(xs:string(current-dateTime()))">
                                <tr class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
                                    <xsl:attribute name="dd:entityid" select="@schedule-event-id"/>
                                    <xsl:attribute name="dd:contenttype" select="'FUTURE_APPTS'"/>
                                
                                    <td style="vertical-align:top; padding-left:6px; word-wrap: break-word;">
                                        <!-- This is a derived variable and doesn't need to go in the i18n string tables -->
                                        <xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON_DAY, $DATE_SEQUENCE_UTC_OFF_DAY)"/>
                                        
                                        <xsl:variable name="ApptTimeZone" as="xs:string" select="n:appointment-begin-dt-tm/@time-zone"/>
                                        <xsl:variable name="time" select="substring(xs:string(xs:time($ApptDtTm)), 0, 9)"/>
                                        <xsl:variable name="midnight" select="'00:00:00'"/>
                                        <span style="font-weight: bold;">
                                            <xsl:value-of select="xr-date-formatter:formatDate($ApptDtTm, $DATE_SEQUENCE_DAY, $ApptTimeZone, $current-locale)"/>
                                            <br/>
                                            <span style="font-weight: 550;font-size: 12pt;">
                                                <xsl:value-of select="xr-date-formatter:formatDate($ApptDtTm, $DATE_SEQUENCE_DATE, $ApptTimeZone, $current-locale)"/>
                                            </span>
                                            <br/>
                                            <xsl:if test="$time != $midnight">
                                                <span style="font-weight: bold;">
                                                    <xsl:value-of select="xr-date-formatter:formatDate($ApptDtTm, $DATE_SEQUENCE_TIME, $ApptTimeZone, $current-locale)"/>
                                                </span>
                                            </xsl:if>
                                            <br/>
										    <br/>
                                       </span>
                                    </td>             
                                    <xsl:if test="@appointment-location-code">
                                        <xsl:variable name="location" select="cdocfx:getLocationById(@appointment-location-code)"/>
                                        <td style="vertical-align:top; padding-left:6px;padding-bottom:10px;word-wrap:break-word">
                                            <table dd:whitespacecolseparator="true">
                                                <xsl:if test="@appointment-personnel-id != 0">
                                                <tr>
                                                    <td style="vertical-align:top; padding-left:50px;">
                                                        <span style="font-weight:bold"><xsl:value-of select="$With"/></span>
                                                    </td>
                                                    <td>
                                                        <xsl:choose>
                                                            <xsl:when test="@appointment-personnel-id">
                                                                <xsl:value-of select="cdocfx:getProviderNameFullByID(@appointment-personnel-id)"/>
                                                            </xsl:when>
                                                            <xsl:otherwise>
                                                                <xsl:value-of select="''"/>
                                                            </xsl:otherwise>
                                                        </xsl:choose>
                                                    </td>
                                                </tr> 
                                                </xsl:if>
                                                <tr>
                                                    <td style="vertical-align:top; padding-left:50px;">
                                                        <span style="font-weight:bold"><xsl:value-of select="$Where"/></span>
                                                    </td>
                                                    <td>
                                                        <xsl:if test="$location/@description">
                                                            <xsl:value-of select="$location/@description"/>
                                                        </xsl:if>
                                                        <xsl:if test="$location/@description and $location/n:business-address">
                                                            <xsl:text disable-output-escaping="yes"><![CDATA[&#124;]]></xsl:text>
                                                        </xsl:if>
                                                        <xsl:if test="$location/n:business-address">
                                                            <xsl:call-template name="DisplayAddress">
                                                                <xsl:with-param name="address" select="$location/n:business-address"/>
                                                            </xsl:call-template>
                                                            <xsl:if test="$location/@business-phone">
                                                                <br/>
                                                                <xsl:value-of select="$location/@business-phone"/>
                                                            </xsl:if>
                                                        </xsl:if>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </xsl:if>
                                </tr>
                            </xsl:if>
                        </xsl:for-each>
                    </tbody>
                </table>
            </xsl:when>
            <xsl:otherwise>
                <!-- Display Nothing -->
                <xsl:value-of select="''"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
